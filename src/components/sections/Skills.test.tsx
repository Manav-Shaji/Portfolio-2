import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';
import { skillGroups } from '@/data/skills';

describe('Skills', () => {
  it('renders each skill group and its items', () => {
    render(<Skills />);

    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    for (const group of skillGroups) {
      expect(screen.getByRole('heading', { name: group.title })).toBeInTheDocument();
      for (const skill of group.items) {
        expect(screen.getByText(skill)).toBeInTheDocument();
      }
    }
  });
});
