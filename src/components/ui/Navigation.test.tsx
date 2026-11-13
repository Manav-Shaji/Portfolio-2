import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { site } from '@/data/site';
import { Navigation } from './Navigation';

afterEach(() => {
  vi.unstubAllGlobals();
});

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

  it('updates the active section on scroll when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const sectionIds = ['about', 'work', 'skills', 'contact'];
    let aboutTop = 500;

    const { container } = render(<Navigation />);
    expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current');

    sectionIds.forEach((id, index) => {
      const section = document.createElement('section');
      section.id = id;
      section.getBoundingClientRect = () =>
        ({ top: index === 0 ? aboutTop : 500 } as DOMRect);
      container.append(section);
    });

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
      expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current');
    });

    aboutTop = 100;
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
        'aria-current',
        'location',
      );
    });
  });
});
