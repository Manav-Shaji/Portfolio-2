import { contactSchema } from '@/lib/contact';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60 * 1000;
const RATE_LIMIT_MAX_CLIENTS = 10_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// This per-instance limiter is best-effort; multi-instance deployments need a shared store.
const requestTimestampsByClient = new Map<string, number[]>();
let lastRateLimitCleanupAt = 0;

function jsonResponse(body: object, status = 200): Response {
  return Response.json(body, { status });
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

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Please check your details and try again.' }, 400);
  }

  const submission = contactSchema.safeParse(body);
  if (!submission.success) {
    return jsonResponse({ error: 'Please check your details and try again.' }, 400);
  }

  if (submission.data.company_url?.trim()) {
    return jsonResponse({ success: true });
  }

  if (isRateLimited(request)) {
    return jsonResponse({ error: 'Too many messages. Please try again later.' }, 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey?.startsWith('re_') || !from || !to) {
    return jsonResponse({ error: 'Contact service is not configured.' }, 503);
  }

  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: submission.data.email,
        subject: `Portfolio contact from ${submission.data.name}`,
        text: submission.data.message,
      }),
    });

    if (!delivery.ok) {
      console.error('Contact email delivery failed with status:', delivery.status);
      return jsonResponse({ error: 'Could not send your message. Please try again.' }, 502);
    }
  } catch (error) {
    const errorKind = error instanceof Error ? error.name : typeof error;
    if (errorKind === 'AbortError' || errorKind === 'TimeoutError') {
      console.error('Contact email delivery request aborted with error kind:', errorKind);
      return jsonResponse({ error: 'Could not send your message. Please try again.' }, 504);
    }

    console.error('Contact email delivery request failed with error kind:', errorKind);
    return jsonResponse({ error: 'Could not send your message. Please try again.' }, 502);
  }

  return jsonResponse({ success: true });
}
