import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const validPayload = {
  name: 'Manav Shaji',
  email: 'manav@example.com',
  message: 'I would like to discuss a role.',
  company_url: '',
};

function createRequest(payload: unknown, clientIp: string): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': clientIp,
    },
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
  vi.restoreAllMocks();
});

describe('POST /api/contact', () => {
  it('rejects invalid submissions without calling Resend', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const response = await POST(
      createRequest({ ...validPayload, email: 'invalid' }, '192.0.2.10'),
    );

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects names containing line breaks', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const response = await POST(
      createRequest({ ...validPayload, name: '\nManav Shaji' }, '192.0.2.17'),
    );

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('accepts honeypot submissions without delivering email', async () => {
    configureEmailEnvironment();
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetch);
    const clientIp = '192.0.2.11';

    const response = await POST(
      createRequest({ ...validPayload, company_url: 'filled by a bot' }, clientIp),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(fetch).not.toHaveBeenCalled();

    for (let requestNumber = 0; requestNumber < 5; requestNumber += 1) {
      const legitimateResponse = await POST(createRequest(validPayload, clientIp));
      expect(legitimateResponse.status).toBe(200);
    }

    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it('sends a valid submission through Resend', async () => {
    configureEmailEnvironment();
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetch);

    const response = await POST(createRequest(validPayload, '192.0.2.12'));
    const [url, options] = fetch.mock.calls[0] as [string, RequestInit];

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(timeout).toHaveBeenCalledWith(10_000);
    expect(url).toBe('https://api.resend.com/emails');
    expect(options.method).toBe('POST');
    expect(options.signal).toBeInstanceOf(AbortSignal);
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

    const response = await POST(createRequest(validPayload, '192.0.2.13'));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: 'Contact service is not configured.',
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('treats an API key without the Resend prefix as unconfigured', async () => {
    vi.stubEnv('RESEND_API_KEY', 'invalid_key');
    vi.stubEnv('RESEND_FROM_EMAIL', 'Portfolio <hello@example.com>');
    vi.stubEnv('CONTACT_EMAIL', 'manav@example.com');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const response = await POST(createRequest(validPayload, '192.0.2.15'));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: 'Contact service is not configured.',
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an explicit failure when Resend rejects delivery', async () => {
    configureEmailEnvironment();
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'invalid request' }), { status: 422 }),
    );
    vi.stubGlobal('fetch', fetch);

    const response = await POST(createRequest(validPayload, '192.0.2.14'));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'Could not send your message. Please try again.' });
  });

  it.each(['AbortError', 'TimeoutError'])(
    'returns 504 for an aborted Resend request (%s)',
    async (errorName) => {
      configureEmailEnvironment();
      const fetch = vi.fn().mockRejectedValue(
        Object.assign(new Error('sensitive request detail'), { name: errorName }),
      );
      vi.stubGlobal('fetch', fetch);
      const logError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await POST(createRequest(validPayload, '192.0.2.16'));

      expect(response.status).toBe(504);
      expect(await response.json()).toEqual({
        error: 'Could not send your message. Please try again.',
      });
      expect(logError).toHaveBeenCalledWith(
        'Contact email delivery request aborted with error kind:',
        errorName,
      );
    },
  );

  it('limits each client to five valid submissions per window', async () => {
    configureEmailEnvironment();
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetch);
    const clientIp = '203.0.113.20';

    for (let requestNumber = 0; requestNumber < 5; requestNumber += 1) {
      const forwardedFor = `${clientIp}, 198.51.100.${requestNumber + 1}`;
      const response = await POST(createRequest(validPayload, forwardedFor));
      expect(response.status).toBe(200);
    }

    expect(fetch).toHaveBeenCalledTimes(5);

    const sixthResponse = await POST(createRequest(validPayload, `${clientIp}, 198.51.100.6`));

    expect(sixthResponse.status).toBe(429);
    expect(await sixthResponse.json()).toEqual({
      error: 'Too many messages. Please try again later.',
    });
    expect(fetch).toHaveBeenCalledTimes(5);
  });
});
