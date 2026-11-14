import * as nodemailer from 'nodemailer';
import { z } from 'zod';
import { contactSchema } from '@/lib/contact';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60 * 1000;
const RATE_LIMIT_MAX_CLIENTS = 10_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_REQUEST_BODY_BYTES = 32 * 1024;
const SMTP_TIMEOUT_MS = 10_000;
const configuredEmailSchema = z.string().email();

// This per-instance limiter is best-effort; multi-instance deployments need a shared store.
const requestTimestampsByClient = new Map<string, number[]>();
let lastRateLimitCleanupAt = 0;

function jsonResponse(body: object, status = 200): Response {
  return Response.json(body, { status });
}

function escapeHtml(value: string): string {
  const escapedCharacters: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };

  return value.replace(/[&<>"']/g, (character) => escapedCharacters[character] ?? character);
}

async function parseRequestBody(
  request: Request,
): Promise<
  { kind: 'valid'; body: unknown } | { kind: 'invalid' } | { kind: 'too-large' }
> {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    return { kind: 'too-large' };
  }

  const reader = request.body?.getReader();
  if (!reader) return { kind: 'invalid' };

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BODY_BYTES) {
        await reader.cancel();
        return { kind: 'too-large' };
      }

      chunks.push(value);
    }

    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bodyBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const bodyText = new TextDecoder('utf-8', { fatal: true }).decode(bodyBytes);
    return { kind: 'valid', body: JSON.parse(bodyText) as unknown };
  } catch {
    return { kind: 'invalid' };
  } finally {
    reader.releaseLock();
  }
}

function isRateLimited(request: Request, now = Date.now()): boolean {
  if (now - lastRateLimitCleanupAt >= RATE_LIMIT_CLEANUP_INTERVAL_MS) {
    for (const [clientKey, timestamps] of requestTimestampsByClient) {
      const activeTimestamps = timestamps.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
      );
      if (activeTimestamps.length === 0) {
        requestTimestampsByClient.delete(clientKey);
      } else {
        requestTimestampsByClient.set(clientKey, activeTimestamps);
      }
    }
    lastRateLimitCleanupAt = now;
  }

  const clientKey = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const recentTimestamps = (requestTimestampsByClient.get(clientKey) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestampsByClient.set(clientKey, recentTimestamps);
    return true;
  }

  if (
    !requestTimestampsByClient.has(clientKey) &&
    requestTimestampsByClient.size >= RATE_LIMIT_MAX_CLIENTS
  ) {
    return true;
  }

  requestTimestampsByClient.set(clientKey, [...recentTimestamps, now]);
  return false;
}

function getSafeSmtpErrorDetails(error: unknown): {
  code: string;
  timeoutType?: string;
} {
  if (typeof error !== 'object' || error === null) return { code: 'UNKNOWN' };

  const details = error as { code?: unknown; timeoutType?: unknown; name?: unknown };
  const code =
    typeof details.code === 'string' && /^[A-Z0-9_]{1,32}$/.test(details.code)
      ? details.code
      : 'UNKNOWN';
  const timeoutType =
    typeof details.timeoutType === 'string' &&
    /^[A-Z0-9_]{1,32}$/.test(details.timeoutType)
      ? details.timeoutType
      : undefined;

  return {
    code,
    ...(timeoutType ? { timeoutType } : {}),
  };
}

function isSmtpTimeout(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const details = error as { code?: unknown; timeoutType?: unknown; name?: unknown };
  return (
    details.code === 'ETIMEDOUT' ||
    (typeof details.timeoutType === 'string' && details.timeoutType.endsWith('_TIMEOUT')) ||
    details.name === 'TimeoutError' ||
    details.name === 'AbortError'
  );
}

export async function POST(request: Request): Promise<Response> {
  const parsedBody = await parseRequestBody(request);
  if (parsedBody.kind === 'too-large') {
    return jsonResponse({ error: 'Please check your details and try again.' }, 413);
  }
  if (parsedBody.kind === 'invalid') {
    return jsonResponse({ error: 'Please check your details and try again.' }, 400);
  }

  const submission = contactSchema.safeParse(parsedBody.body);
  if (!submission.success) {
    return jsonResponse({ error: 'Please check your details and try again.' }, 400);
  }

  if (submission.data.company_url?.trim()) {
    return jsonResponse({ success: true });
  }

  if (isRateLimited(request)) {
    return jsonResponse({ error: 'Too many messages. Please try again later.' }, 429);
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  const recipient = process.env.CONTACT_EMAIL?.trim();
  if (
    !gmailUser ||
    !configuredEmailSchema.safeParse(gmailUser).success ||
    !gmailAppPassword ||
    !recipient ||
    !configuredEmailSchema.safeParse(recipient).success
  ) {
    return jsonResponse({ error: 'Contact service is not configured.' }, 503);
  }

  const { name, email, message } = submission.data;
  const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    '<p><strong>Message:</strong></p>',
    `<pre style="white-space:pre-wrap;font:inherit">${escapeHtml(message)}</pre>`,
  ].join('');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS,
    });

    try {
      await transporter.sendMail({
        from: { name: 'Manav Shaji', address: gmailUser },
        to: recipient,
        replyTo: email,
        subject: 'New Portfolio Contact Message',
        text,
        html,
      });
    } finally {
      transporter.close();
    }
  } catch (error) {
    const errorDetails = getSafeSmtpErrorDetails(error);
    const timedOut = isSmtpTimeout(error);
    console.error('Contact email delivery failed:', {
      ...errorDetails,
      ...(timedOut && errorDetails.code === 'UNKNOWN' ? { code: 'ETIMEDOUT' } : {}),
    });
    return jsonResponse(
      { error: 'Could not send your message. Please try again.' },
      timedOut ? 504 : 502,
    );
  }

  return jsonResponse({ success: true });
}
