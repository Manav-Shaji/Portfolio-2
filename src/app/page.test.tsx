import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { Marquee } from '../components/Marquee';
import { SocialLinks } from '../components/SocialLinks';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the portfolio hero and primary sections', () => {
    const { container } = render(React.createElement(HomePage));

    expect(container.querySelectorAll('.background-fx')).toHaveLength(1);
    expect(screen.getByRole('progressbar', { name: 'Page scroll progress' })).toBeInTheDocument();
    expect(screen.getByText('initializing portfolio...')).toBeInTheDocument();
    expect(screen.getAllByText(/manav shaji/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /work/i })).toBeInTheDocument();
    expect(screen.getAllByText(/02 — work/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Reliable software.');
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
    expect(screen.getAllByRole('group', { name: 'Social links' })).toHaveLength(2);
    expect(container.querySelectorAll('.project-preview')).toHaveLength(3);
    expect(screen.getByText('View', { selector: '.cursor-label' })).toBeInTheDocument();
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

describe('Marquee', () => {
  it('renders two decorative copies of the technology list', () => {
    const { container } = render(React.createElement(Marquee));

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
