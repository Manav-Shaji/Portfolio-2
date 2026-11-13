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

  it('scrolls to and focuses a section from the command palette', async () => {
    renderNavigation();
    fireEvent.click(screen.getByRole('button', { name: /Quick nav/ }));

    const commandItem = await screen.findByRole('option', { name: 'About me' });
    fireEvent.click(commandItem);

    const section = document.getElementById('about');
    expect(section).toHaveAttribute('tabindex', '-1');
    await waitFor(() => expect(section).toHaveFocus());
  });
});
