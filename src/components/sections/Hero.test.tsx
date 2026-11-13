import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { site } from '@/data/site';

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
});
