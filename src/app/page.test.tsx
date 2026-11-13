import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('composes the portfolio sections and primary navigation', () => {
    render(<HomePage />);

    expect(screen.getByRole('main')).toHaveAttribute('id', 'home');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Reliable software.',
    );
    for (const id of ['about', 'work', 'skills', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
  });
});
