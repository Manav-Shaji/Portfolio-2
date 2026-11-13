import { fireEvent, render, screen } from '@testing-library/react';
import { site } from '@/data/site';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  it('links to the downloadable resume from desktop and mobile navigation', () => {
    render(<Navigation />);

    const desktopResumeLink = screen.getByRole('link', { name: 'Resume' });
    expect(desktopResumeLink).toHaveAttribute('href', site.resumeUrl);
    expect(desktopResumeLink).toHaveAttribute('download');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle mobile navigation' }));

    const resumeLinks = screen.getAllByRole('link', { name: 'Resume' });
    expect(resumeLinks).toHaveLength(2);
    for (const link of resumeLinks) {
      expect(link).toHaveAttribute('href', site.resumeUrl);
      expect(link).toHaveAttribute('download');
    }
  });
});
