import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { toast } from 'sonner';
import { site } from '@/data/site';
import { Contact } from './Contact';
import { ContactForm } from './ContactForm';
import { ContactFormLoader } from './ContactFormLoader';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Contact', () => {
  it('renders the contact information and form', () => {
    render(<Contact />);

    const card = within(screen.getByRole('article', { name: 'Contact details' }));
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
    expect(card.getByText('Open to full-time roles · 2026')).toBeInTheDocument();
    expect(card.getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    );
    expect(card.getByRole('button', { name: 'Copy email address' })).toBeInTheDocument();
    expect(card.queryByRole('group', { name: 'Social links' })).not.toBeInTheDocument();
    expect(card.getByRole('timer', { name: 'Local time in Kerala' })).toHaveTextContent(
      /^(?:--:--|(?:1[0-2]|[1-9]):[0-5]\d [AP]M) IST$/,
    );
    expect(card.getByText('Usually within a few days')).toBeInTheDocument();
    expect(site.resumeUrl).toBe('/Resume.pdf');
    if (site.resumeUrl !== null) {
      const resumeLink = card.getByRole('link', { name: 'Download resume' });
      expect(resumeLink).toHaveAttribute('href', site.resumeUrl);
      expect(resumeLink).toHaveAttribute('download');
    } else {
      expect(card.queryByRole('link', { name: 'Download resume' })).not.toBeInTheDocument();
    }
  });

  it('copies the contact email and confirms success with a toast', async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: clipboard,
    });

    try {
      render(<Contact />);
      fireEvent.click(screen.getByRole('button', { name: 'Copy email address' }));

      await waitFor(() => {
        expect(clipboard.writeText).toHaveBeenCalledWith(site.email);
        expect(toast.success).toHaveBeenCalledWith('Email copied');
      });
    } finally {
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', originalClipboard);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  });

  it('posts form values to the contact API and confirms success', async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetch);
    render(<ContactForm />);
    const form = within(screen.getByRole('button', { name: 'Send message' }).closest('form')!);

    fireEvent.change(form.getByLabelText('Name'), { target: { value: 'Manav Shaji' } });
    fireEvent.change(form.getByLabelText('Email'), { target: { value: 'manav@example.com' } });
    fireEvent.change(form.getByLabelText('Message'), {
      target: { value: 'I would like to discuss a role.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Manav Shaji',
            email: 'manav@example.com',
            message: 'I would like to discuss a role.',
            company_url: '',
          }),
        }),
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Message sent — I will get back to you soon.',
      );
      expect(form.getByLabelText('Name')).toHaveValue('');
      expect(form.getByLabelText('Email')).toHaveValue('');
      expect(form.getByLabelText('Message')).toHaveValue('');
    });
  });

  it('shows a failure message and keeps entered values when delivery fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'Could not send your message. Please try again.' }), {
          status: 502,
        }),
      ),
    );
    render(<ContactForm />);
    const form = within(screen.getByRole('button', { name: 'Send message' }).closest('form')!);

    fireEvent.change(form.getByLabelText('Name'), { target: { value: 'Manav Shaji' } });
    fireEvent.change(form.getByLabelText('Email'), { target: { value: 'manav@example.com' } });
    fireEvent.change(form.getByLabelText('Message'), {
      target: { value: 'I would like to discuss a role.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Could not send your message. Please try again.',
      );
    });
    expect(form.getByLabelText('Name')).toHaveValue('Manav Shaji');
    expect(form.getByLabelText('Email')).toHaveValue('manav@example.com');
    expect(form.getByLabelText('Message')).toHaveValue('I would like to discuss a role.');
  });

  it('associates validation errors with fields and exposes their limits', async () => {
    render(<ContactForm />);

    const name = screen.getByLabelText('Name');
    const email = screen.getByLabelText('Email');
    const message = screen.getByLabelText('Message');

    expect(name).toHaveAttribute('maxLength', '100');
    expect(email).toHaveAttribute('maxLength', '254');
    expect(message).toHaveAttribute('maxLength', '5000');
    expect(name).toHaveAttribute('autoComplete', 'name');
    expect(email).toHaveAttribute('autoComplete', 'email');
    expect(name).toHaveAttribute('aria-required', 'true');
    expect(email).toHaveAttribute('aria-required', 'true');
    expect(message).toHaveAttribute('aria-required', 'true');
    expect(name).not.toHaveAttribute('aria-describedby');
    expect(email).not.toHaveAttribute('aria-describedby');
    expect(message).not.toHaveAttribute('aria-describedby');

    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => {
      expect(name).toHaveAttribute('aria-invalid', 'true');
      expect(name).toHaveAttribute('aria-describedby', 'name-error');
      expect(screen.getByText('Please enter your name.')).toHaveAttribute('id', 'name-error');
      expect(email).toHaveAttribute('aria-invalid', 'true');
      expect(email).toHaveAttribute('aria-describedby', 'email-error');
      expect(screen.getByText('Please enter a valid email.')).toHaveAttribute('id', 'email-error');
      expect(message).toHaveAttribute('aria-invalid', 'true');
      expect(message).toHaveAttribute('aria-describedby', 'message-error');
      expect(
        screen.getByText('Tell me a bit more about your project or role.'),
      ).toHaveAttribute('id', 'message-error');
    });
  });

  describe('ContactFormLoader', () => {
    it('loads the form when its placeholder approaches the viewport', async () => {
      let formObserver: TestIntersectionObserver | undefined;

      class TestIntersectionObserver implements IntersectionObserver {
        readonly root: Element | Document | null = null;
        readonly rootMargin: string;
        readonly thresholds: ReadonlyArray<number> = [];

        constructor(
          private readonly callback: IntersectionObserverCallback,
          options?: IntersectionObserverInit,
        ) {
          this.rootMargin = options?.rootMargin ?? '0px';
          if (this.rootMargin === '600px 0px') formObserver = this;
        }

        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords(): IntersectionObserverEntry[] {
          return [];
        }

        trigger(target: Element) {
          this.callback(
            [
              {
                boundingClientRect: new DOMRectReadOnly(),
                intersectionRatio: 1,
                intersectionRect: new DOMRectReadOnly(),
                isIntersecting: true,
                rootBounds: null,
                target,
                time: performance.now(),
              },
            ],
            this,
          );
        }
      }

      vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
      const { container } = render(<ContactFormLoader />);

      expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();

      act(() => formObserver?.trigger(container.firstElementChild!));

      expect(await screen.findByRole('button', { name: 'Send message' })).toBeVisible();
    });

    it('loads the form immediately when IntersectionObserver is unavailable', async () => {
      vi.stubGlobal('IntersectionObserver', undefined);

      render(<ContactFormLoader />);

      expect(await screen.findByRole('button', { name: 'Send message' })).toBeVisible();
    });
  });

  it('disables the submit button while the contact request is pending', async () => {
    let resolveResponse: ((response: Response) => void) | undefined;
    const responsePromise = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    const fetch = vi.fn(() => responsePromise);
    vi.stubGlobal('fetch', fetch);
    render(<ContactForm />);
    const form = within(screen.getByRole('button', { name: 'Send message' }).closest('form')!);

    fireEvent.change(form.getByLabelText('Name'), { target: { value: 'Manav Shaji' } });
    fireEvent.change(form.getByLabelText('Email'), { target: { value: 'manav@example.com' } });
    fireEvent.change(form.getByLabelText('Message'), {
      target: { value: 'I would like to discuss a role.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    const pendingButton = await screen.findByRole('button', { name: 'Sending...' });
    expect(pendingButton).toBeDisabled();
    fireEvent.click(pendingButton);
    expect(fetch).toHaveBeenCalledTimes(1);
    resolveResponse?.(new Response(JSON.stringify({ success: true }), { status: 200 }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});
