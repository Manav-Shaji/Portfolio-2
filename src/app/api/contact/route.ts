import { z } from 'zod';

const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(100).refine((value) => !/[\r\n]/.test(value)),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  website: z.string().optional(),
});

function jsonResponse(body: object, status = 200): Response {
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Please check your details and try again.' }, 400);
  }

  const submission = contactSubmissionSchema.safeParse(body);
  if (!submission.success) {
    return jsonResponse({ error: 'Please check your details and try again.' }, 400);
  }

  if (submission.data.website?.trim()) {
    return jsonResponse({ success: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !from || !to) {
    return jsonResponse({ error: 'Contact service is not configured.' }, 503);
  }

  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
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
    console.error('Contact email delivery request failed.', error);
    return jsonResponse({ error: 'Could not send your message. Please try again.' }, 502);
  }

  return jsonResponse({ success: true });
}
