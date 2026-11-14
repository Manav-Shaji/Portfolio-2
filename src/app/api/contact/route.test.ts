import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const { closeMock, createTransportMock, sendMailMock } = vi.hoisted(() => ({
  closeMock: vi.fn(),
  createTransportMock: vi.fn(),
  sendMailMock: vi.fn(),
}));

vi.mock('nodemailer', () => ({
  createTransport: createTransportMock,
}));

const validPayload = {
  name: 'Manav Shaji',
  email: 'visitor@example.com',
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
  vi.stubEnv('GMAIL_USER', 'manav.shaji.m@gmail.com');
  vi.stubEnv('GMAIL_APP_PASSWORD', 'test-app-password-secret');
  vi.stubEnv('CONTACT_EMAIL', 'manav.shaji.m@gmail.com');
}

beforeEach(() => {
  closeMock.mockReset();
  sendMailMock.mockReset().mockResolvedValue({ messageId: 'message_123' });
  createTransportMock.mockReset().mockReturnValue({
    close: closeMock,
    sendMail: sendMailMock,
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/contact', () => {
  it('rejects invalid submissions without creating an SMTP transport', async () => {
    const response = await POST(
      createRequest({ ...validPayload, email: 'invalid' }, '192.0.2.10'),
    );

    expect(response.status).toBe(400);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('rejects names containing line breaks', async () => {
    const response = await POST(
      createRequest({ ...validPayload, name: '\nManav Shaji' }, '192.0.2.17'),
    );

    expect(response.status).toBe(400);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('rejects request bodies larger than the configured maximum', async () => {
    const response = await POST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '192.0.2.23',
        },
        body: JSON.stringify({ message: 'x'.repeat(33_000) }),
      }),
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({
      error: 'Please check your details and try again.',
    });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('accepts honeypot submissions without delivering or consuming rate limit', async () => {
    configureEmailEnvironment();
    const clientIp = '192.0.2.11';

    const response = await POST(
      createRequest({ ...validPayload, company_url: 'filled by a bot' }, clientIp),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(createTransportMock).not.toHaveBeenCalled();

    for (let requestNumber = 0; requestNumber < 5; requestNumber += 1) {
      const legitimateResponse = await POST(createRequest(validPayload, clientIp));
      expect(legitimateResponse.status).toBe(200);
    }

    expect(sendMailMock).toHaveBeenCalledTimes(5);
  });

  it('sends a valid submission through Gmail SMTP with the expected sender and reply-to', async () => {
    configureEmailEnvironment();

    const response = await POST(createRequest(validPayload, '192.0.2.12'));

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ success: true });
    expect(createTransportMock).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'manav.shaji.m@gmail.com',
        pass: 'test-app-password-secret',
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: { name: 'Manav Shaji', address: 'manav.shaji.m@gmail.com' },
      to: 'manav.shaji.m@gmail.com',
      replyTo: 'visitor@example.com',
      subject: 'New Portfolio Contact Message',
      text: 'Name: Manav Shaji\nEmail: visitor@example.com\n\nMessage:\nI would like to discuss a role.',
      html: expect.stringContaining('<p><strong>Name:</strong> Manav Shaji</p>'),
    });
    expect(closeMock).toHaveBeenCalledOnce();
    expect(JSON.stringify(responseBody)).not.toContain('test-app-password-secret');
  });

  it('escapes user content in the HTML email while preserving readable text', async () => {
    configureEmailEnvironment();

    await POST(
      createRequest(
        {
          ...validPayload,
          name: 'Manav <Admin> & Co',
          message: '<script>alert("x")</script> & hello',
        },
        '192.0.2.21',
      ),
    );

    const email = sendMailMock.mock.calls[0][0] as { html: string; text: string };
    expect(email.html).toContain('Manav &lt;Admin&gt; &amp; Co');
    expect(email.html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; hello');
    expect(email.html).not.toContain('<script>');
    expect(email.text).toContain('Name: Manav <Admin> & Co');
    expect(email.text).toContain('<script>alert("x")</script> & hello');
  });

  it.each([
    ['GMAIL_USER', 'GMAIL_USER', ''],
    ['GMAIL_APP_PASSWORD', 'GMAIL_APP_PASSWORD', ''],
    ['CONTACT_EMAIL', 'CONTACT_EMAIL', ''],
  ])('returns 503 when %s is missing', async (_label, variable, value) => {
    configureEmailEnvironment();
    vi.stubEnv(variable, value);

    const response = await POST(
      createRequest(validPayload, `192.0.2.${30 + variable.length}`),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: 'Contact service is not configured.',
    });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it.each([
    ['GMAIL_USER', 'not-an-email', '192.0.2.24'],
    ['CONTACT_EMAIL', 'not-an-email', '192.0.2.27'],
  ])('rejects invalid %s without creating a transport', async (variable, value, clientIp) => {
    configureEmailEnvironment();
    vi.stubEnv(variable, value);

    const response = await POST(createRequest(validPayload, clientIp));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: 'Contact service is not configured.',
    });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('returns a safe failure when Gmail rejects SMTP authentication', async () => {
    configureEmailEnvironment();
    sendMailMock.mockRejectedValue(
      Object.assign(new Error('Sensitive SMTP response and password'), {
        code: 'EAUTH',
        response: '535 Sensitive server details',
      }),
    );
    const logError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(createRequest(validPayload, '192.0.2.25'));

    expect(response.status).toBe(502);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      error: 'Could not send your message. Please try again.',
    });
    expect(JSON.stringify(responseBody)).not.toContain('test-app-password-secret');
    expect(logError).toHaveBeenCalledWith('Contact email delivery failed:', {
      code: 'EAUTH',
      timeoutType: undefined,
    });
    expect(JSON.stringify(logError.mock.calls)).not.toContain(
      'test-app-password-secret',
    );
    expect(JSON.stringify(logError.mock.calls)).not.toContain(
      'Sensitive SMTP response and password',
    );
    expect(JSON.stringify(logError.mock.calls)).not.toContain(validPayload.email);
    expect(JSON.stringify(logError.mock.calls)).not.toContain(validPayload.message);
    expect(closeMock).toHaveBeenCalledOnce();
  });

  it('returns 504 when SMTP times out', async () => {
    configureEmailEnvironment();
    sendMailMock.mockRejectedValue(
      Object.assign(new Error('Sensitive timeout details'), {
        code: 'ETIMEDOUT',
        timeoutType: 'SOCKET_TIMEOUT',
      }),
    );
    const logError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(createRequest(validPayload, '192.0.2.26'));

    expect(response.status).toBe(504);
    expect(await response.json()).toEqual({
      error: 'Could not send your message. Please try again.',
    });
    expect(logError).toHaveBeenCalledWith('Contact email delivery failed:', {
      code: 'ETIMEDOUT',
      timeoutType: 'SOCKET_TIMEOUT',
    });
    expect(closeMock).toHaveBeenCalledOnce();
  });

  it('limits each client to five valid submissions per window', async () => {
    configureEmailEnvironment();
    const clientIp = '203.0.113.20';

    for (let requestNumber = 0; requestNumber < 5; requestNumber += 1) {
      const forwardedFor = `${clientIp}, 198.51.100.${requestNumber + 1}`;
      const response = await POST(createRequest(validPayload, forwardedFor));
      expect(response.status).toBe(200);
    }

    expect(sendMailMock).toHaveBeenCalledTimes(5);

    const sixthResponse = await POST(
      createRequest(validPayload, `${clientIp}, 198.51.100.6`),
    );

    expect(sixthResponse.status).toBe(429);
    expect(await sixthResponse.json()).toEqual({
      error: 'Too many messages. Please try again later.',
    });
    expect(sendMailMock).toHaveBeenCalledTimes(5);
  });
});
