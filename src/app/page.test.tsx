import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { toast } from 'sonner';
import { vi } from 'vitest';
import { ContactFormFields } from '../components/ContactFormFields';
import { Marquee } from '../components/Marquee';
import { SocialLinks } from '../components/SocialLinks';
import { site } from '../data/site';
import HomePage from './page';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('HomePage', () => {
  it('renders the portfolio hero and primary sections', () => {
    const { container } = render(React.createElement(HomePage));

    expect(screen.getByText('initializing portfolio...')).toBeInTheDocument();
    expect(screen.getAllByText(/manav shaji/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Work' }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/02 — work/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Reliable software.');
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
    expect(screen.getAllByRole('group', { name: 'Social links' })).toHaveLength(3);
    const contactCard = within(screen.getByRole('article', { name: 'Contact details' }));
    expect(contactCard.getByText('Open to full-time roles · 2026')).toBeInTheDocument();
    expect(contactCard.getByRole('link', { name: 'manav.shaji.m@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:manav.shaji.m@gmail.com',
    );
    expect(contactCard.getByRole('button', { name: 'Copy email address' })).toBeInTheDocument();
    expect(contactCard.getByText('Location')).toBeInTheDocument();
    expect(contactCard.getByText('Kerala, India ·')).toBeInTheDocument();
    expect(contactCard.getByText('Response time')).toBeInTheDocument();
    expect(contactCard.getByText('Usually within 24 hours')).toBeInTheDocument();
    expect(contactCard.getByText('How I can help')).toBeInTheDocument();
    for (const service of [
      'Frontend development',
      'Full-stack apps',
      'UI implementation',
      'Performance tuning',
    ]) {
      expect(contactCard.getByText(service)).toBeInTheDocument();
    }
    expect(contactCard.getByRole('link', { name: 'Download resume' })).toHaveAttribute(
      'href',
      '/resume.pdf',
    );
    expect(contactCard.getByRole('link', { name: 'Download resume' })).toHaveAttribute('download');
    expect(contactCard.getByRole('timer', { name: 'Local time in Kerala' })).toHaveTextContent(
      /^\d{2}:\d{2} IST$/,
    );
    expect(container.querySelectorAll('.project-preview')).toHaveLength(3);
    expect(container.querySelectorAll('[data-reveal="mask"] .reveal-heading-rule')).toHaveLength(4);
    expect(container.querySelectorAll('#work .project-preview-clip[data-reveal="clip"]')).toHaveLength(3);
    expect(container.querySelector('#about .about-scroll-paragraph')?.textContent).toBe(
      'I enjoy turning product requirements into experiences that feel clear, polished, and reliable. My work sits at the intersection of design thinking, front-end craft, and practical engineering decisions that keep teams moving.',
    );

    const footer = within(screen.getByRole('contentinfo'));
    expect(footer.getByText('© 2026 Manav Shaji')).toBeInTheDocument();
    expect(footer.queryByText('Frontend & full-stack developer')).not.toBeInTheDocument();
    expect(footer.queryByText('Kerala, India')).not.toBeInTheDocument();
    const footerNavigation = within(
      footer.getByRole('navigation', { name: 'Footer navigation' }),
    );
    for (const label of ['About', 'Work', 'Skills', 'Contact']) {
      expect(footerNavigation.getByRole('link', { name: label })).not.toHaveAttribute('aria-current');
    }
    expect(footer.getAllByRole('group', { name: 'Social links' })).toHaveLength(1);
    expect(footer.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#home');
    expect(footer.queryByText('Have a role or project in mind?')).not.toBeInTheDocument();
    expect(footer.queryByText('manavshaji.dev@gmail.com')).not.toBeInTheDocument();
    expect(footer.queryByText('MANAV SHAJI')).not.toBeInTheDocument();
  });

  it('copies the contact email and confirms success with a toast', async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: clipboard,
    });

    try {
      render(React.createElement(HomePage));
      const contactCard = within(screen.getByRole('article', { name: 'Contact details' }));
      fireEvent.click(contactCard.getByRole('button', { name: 'Copy email address' }));

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
});

describe('SocialLinks', () => {
  it('renders labeled social destinations with safe external-link behavior', () => {
    render(React.createElement(SocialLinks, { size: 'md' }));

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Manav-Shaji',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/manavshaji/',
    );
    for (const label of ['GitHub', 'LinkedIn', 'Email']) {
      const icon = screen.getByRole('link', { name: label }).children[0];
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
    }
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('rel', 'noreferrer');
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:manavshaji.dev@gmail.com',
    );
    expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
  });

  it('keeps compact social icons intrinsically sized', () => {
    render(React.createElement(SocialLinks, { size: 'sm' }));

    for (const label of ['GitHub', 'LinkedIn', 'Email']) {
      const icon = screen.getByRole('link', { name: label }).children[0];
      expect(icon).toHaveAttribute('width', '16');
      expect(icon).toHaveAttribute('height', '16');
    }
  });
});

describe('ContactFormFields', () => {
  it('uses the Send message label and a send icon', () => {
    const { container } = render(React.createElement(ContactFormFields));

    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
    expect(container.querySelector('svg.lucide-send')).toBeInTheDocument();
  });

  it('keeps the sending state disabled', () => {
    render(React.createElement(ContactFormFields, { isSubmitting: true }));

    expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled();
  });
});

describe('Marquee', () => {
  it('renders two decorative copies of the technology list', () => {
    const { container } = render(React.createElement(Marquee, { items: site.marquee }));

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');

    for (const technology of [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'GSAP',
      'Motion',
      'Node.js',
      'Python',
      'PostgreSQL',
    ]) {
      expect(screen.getAllByText(technology)).toHaveLength(2);
    }
  });
});
