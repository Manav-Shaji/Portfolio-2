import { render, screen, within } from '@testing-library/react';
import { projects } from '@/data/projects';
import { Work } from './Work';

describe('Work', () => {
  it('does not present projects without destinations as links or case studies', () => {
    render(<Work />);

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(projects.length);

    for (const card of cards) {
      expect(card).toHaveAttribute('data-has-link', 'false');
      expect(within(card).queryByRole('link')).not.toBeInTheDocument();
      expect(within(card).queryByText('Case study')).not.toBeInTheDocument();
    }
  });
});
