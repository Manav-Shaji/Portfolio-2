import React from 'react';
import { render, screen } from '@testing-library/react';
import { SocialLinks } from '../components/SocialLinks';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the portfolio hero and primary sections', () => {
    render(React.createElement(HomePage));

    expect(screen.getAllByText(/manav shaji/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /work/i })).toBeInTheDocument();
    expect(screen.getAllByText(/02 — work/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Reliable software.');
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
    expect(screen.getAllByRole('group', { name: 'Social links' })).toHaveLength(3);
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
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('rel', 'noreferrer');
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:manavshaji.dev@gmail.com',
    );
    expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
  });
});
