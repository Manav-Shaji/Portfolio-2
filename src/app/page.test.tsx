import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('composes the portfolio sections and primary navigation', () => {
    const { container } = render(<HomePage />);

    const skipLink = screen.getByRole('link', { name: 'Skip to content' });
    expect(screen.getByRole('main')).toHaveAttribute('id', 'home');
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(skipLink).toHaveAttribute('href', '#home');
    expect(container.querySelector('div')?.firstElementChild).toBe(skipLink);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Reliable software.',
    );
    for (const id of ['about', 'work', 'skills', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
  });
});
