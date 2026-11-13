import { StrictMode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach } from 'vitest';
import { Hero } from './Hero';
import { site } from '@/data/site';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('Hero', () => {
  it('renders the headline, actions, social links, and tech marquee', () => {
    const { container } = render(<Hero />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Reliable software.',
    );
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute(
      'href',
      '#work',
    );
    expect(screen.getByRole('link', { name: /let’s talk/i })).toHaveAttribute(
      'href',
      '#contact',
    );
    expect(screen.getByRole('group', { name: 'Social links' })).toBeInTheDocument();
    expect(container.querySelector('.tech-marquee')).toHaveAttribute('aria-hidden', 'true');

    for (const technology of site.marquee) {
      expect(screen.getAllByText(technology)).toHaveLength(2);
    }
  });

  it('keeps the heading visible during its first-visit motion', async () => {
    const { container } = render(
      <StrictMode>
        <main id="home">
          <Hero />
        </main>
      </StrictMode>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
    await waitFor(() =>
      expect(container.querySelector('#home')).toHaveAttribute('data-hero-intro', 'true'),
    );
  });

  it('skips the intro on return visits in the same session', () => {
    window.sessionStorage.setItem('portfolio-intro-seen', 'true');

    const { container } = render(
      <main id="home">
        <Hero />
      </main>,
    );

    expect(container.querySelector('#home')).not.toHaveAttribute('data-hero-intro');
  });
});
