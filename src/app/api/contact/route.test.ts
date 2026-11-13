import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const validPayload = {
  name: 'Manav Shaji',
  email: 'manav@example.com',
  message: 'I would like to discuss a role.',
  website: '',
};

function createRequest(payload: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

function configureEmailEnvironment(): void {
  vi.stubEnv('RESEND_API_KEY', 're_test_key');
  vi.stubEnv('RESEND_FROM_EMAIL', 'Portfolio <hello@example.com>');
  vi.stubEnv('CONTACT_EMAIL', 'manav@example.com');
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('POST /api/contact', () => {
  it('rejects invalid submissions without calling Resend', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const response = await POST(createRequest({ ...validPayload, email: 'invalid' }));

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('accepts honeypot submissions without delivering email', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const response = await POST(
      createRequest({ ...validPayload, website: 'filled by a bot' }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends a valid submission through Resend', async () => {
    configureEmailEnvironment();
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetch);

    const response = await POST(createRequest(validPayload));
    const [url, options] = fetch.mock.calls[0] as [string, RequestInit];

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(url).toBe('https://api.resend.com/emails');
    expect(options.method).toBe('POST');
    expect(JSON.parse(String(options.body))).toEqual({
      from: 'Portfolio <hello@example.com>',
      to: ['manav@example.com'],
      reply_to: 'manav@example.com',
      subject: 'Portfolio contact from Manav Shaji',
      text: 'I would like to discuss a role.',
    });
  });

  it('reports an unavailable service when email configuration is missing', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an explicit failure when Resend rejects delivery', async () => {
    configureEmailEnvironment();
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'invalid request' }), { status: 422 }),
    );
    vi.stubGlobal('fetch', fetch);

    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'Could not send your message. Please try again.' });
  });
});
