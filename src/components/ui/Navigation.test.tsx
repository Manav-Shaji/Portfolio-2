import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { Navigation } from './Navigation';

const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  if (originalScrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: originalScrollIntoView,
    });
  } else {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  }
  vi.unstubAllGlobals();
});

function renderNavigation() {
  render(
    <>
      <Navigation />
      <section id="about">About section</section>
    </>,
  );
}

describe('Navigation', () => {
  it('does not render a Quick nav button', () => {
    renderNavigation();

    expect(screen.queryByRole('button', { name: /Quick nav/ })).not.toBeInTheDocument();
  });

  it('renders the configured resume download link', () => {
    renderNavigation();

    const resumeLink = screen.getByRole('link', { name: 'Resume' });
    expect(resumeLink).toHaveAttribute('href', '/Resume.pdf');
    expect(resumeLink).toHaveAttribute('download');
  });

  it('scrolls to and focuses a section from a navigation link', async () => {
    const scrollIntoView = Element.prototype.scrollIntoView;
    renderNavigation();

    fireEvent.click(screen.getByRole('link', { name: 'About' }));

    const section = document.getElementById('about');
    expect(section).toHaveAttribute('tabindex', '-1');
    expect(window.location.hash).toBe('#about');
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    await waitFor(() => expect(section).toHaveFocus());
  });

  it('does not open command navigation from Cmd+K or Ctrl+K', () => {
    renderNavigation();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the mobile menu with Escape', () => {
    renderNavigation();
    const menuButton = screen.getByRole('button', { name: 'Toggle mobile navigation' });

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
