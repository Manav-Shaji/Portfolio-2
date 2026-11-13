import { render, screen } from '@testing-library/react';
import { About } from './About';
import { aboutStatement, introStats } from '@/data/site';

describe('About', () => {
  it('renders the introduction, focus card, and stats', () => {
    render(<About />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    const paragraph = screen.getByText((_, node) =>
      node?.classList.contains('about-scroll-paragraph') ?? false,
    );
    expect(paragraph.textContent?.replace(/\s+/g, ' ').trim()).toBe(aboutStatement);
    expect(screen.getByText('Full-stack product work')).toBeInTheDocument();

    for (const [label, value] of introStats) {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  });
});
