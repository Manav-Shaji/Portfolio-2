import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { toast } from 'sonner';
import { Contact } from './Contact';
import { ContactForm } from './ContactForm';

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
    expect(card.getByRole('link', { name: 'manav.shaji.m@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:manav.shaji.m@gmail.com',
    );
    expect(card.getByRole('button', { name: 'Copy email address' })).toBeInTheDocument();
    expect(card.getByRole('timer', { name: 'Local time in Kerala' })).toHaveTextContent(
      /^(?:--:--|\d{2}:\d{2}) IST$/,
    );
    expect(card.getByText('Usually within 24 hours')).toBeInTheDocument();
    expect(card.getByRole('link', { name: 'Download resume' })).toHaveAttribute(
      'href',
      '/resume.pdf',
    );
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
        expect(clipboard.writeText).toHaveBeenCalledWith('manav.shaji.m@gmail.com');
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
            website: '',
          }),
        }),
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Message sent — I will get back to you soon.',
      );
    });
  });

  it('disables the submit button while the contact request is pending', async () => {
    let resolveResponse: ((response: Response) => void) | undefined;
    const responsePromise = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    vi.stubGlobal('fetch', vi.fn(() => responsePromise));
    render(<ContactForm />);
    const form = within(screen.getByRole('button', { name: 'Send message' }).closest('form')!);

    fireEvent.change(form.getByLabelText('Name'), { target: { value: 'Manav Shaji' } });
    fireEvent.change(form.getByLabelText('Email'), { target: { value: 'manav@example.com' } });
    fireEvent.change(form.getByLabelText('Message'), {
      target: { value: 'I would like to discuss a role.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByRole('button', { name: 'Sending...' })).toBeDisabled();
    resolveResponse?.(new Response(JSON.stringify({ success: true }), { status: 200 }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});
