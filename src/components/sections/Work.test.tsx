import { render, screen, within } from '@testing-library/react';
import { Work } from './Work';
import { projects } from '@/data/projects';

describe('Work', () => {
  it('renders every project from the projects data file', () => {
    render(<Work />);

    expect(screen.getByRole('heading', { name: 'Work' })).toBeInTheDocument();
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(projects.length);

    projects.forEach((project, index) => {
      const card = within(cards[index]);
      expect(card.getByText(project.name)).toBeInTheDocument();
      expect(card.getByText(project.type)).toBeInTheDocument();
      expect(card.getByText(project.summary)).toBeInTheDocument();

      for (const technology of project.stack) {
        expect(card.getByText(technology)).toBeInTheDocument();
      }
    });
  });
});
