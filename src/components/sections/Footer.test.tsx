import { render, screen, within } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders footer navigation, social links, and the back-to-top link', () => {
    render(<Footer />);

    const navigation = within(
      screen.getByRole('navigation', { name: 'Footer navigation' }),
    );
    for (const label of ['About', 'Work', 'Skills', 'Contact']) {
      const link = navigation.getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', `#${label.toLowerCase()}`);
      expect(link).not.toHaveAttribute('aria-current');
    }

    expect(screen.getByText('© 2026 Manav Shaji')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute(
      'href',
      '#home',
    );
    const socials = within(screen.getByRole('group', { name: 'Social links' }));
    expect(socials.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Manav-Shaji',
    );
    expect(socials.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/manavshaji/',
    );
    expect(socials.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:manavshaji.dev@gmail.com',
    );
  });
});
