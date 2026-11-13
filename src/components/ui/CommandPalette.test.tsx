import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';

const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeEach(() => {
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

function renderCommandPalette(onNavigate = vi.fn()) {
  const onOpenChange = vi.fn();
  render(
    <CommandPalette open onOpenChange={onOpenChange} onNavigate={onNavigate} />,
  );

  return { onNavigate, onOpenChange };
}

describe('CommandPalette', () => {
  it('does not navigate when ArrowDown changes the highlighted item', () => {
    const { onNavigate, onOpenChange } = renderCommandPalette();

    fireEvent.keyDown(screen.getByPlaceholderText('Search sections...'), {
      key: 'ArrowDown',
    });

    expect(onNavigate).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('navigates when an item is selected with a click', () => {
    const { onNavigate } = renderCommandPalette();

    fireEvent.click(screen.getByRole('option', { name: 'About me' }));

    expect(onNavigate).toHaveBeenCalledWith('about');
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('navigates when an item is selected with Enter', () => {
    const { onNavigate } = renderCommandPalette();
    const input = screen.getByPlaceholderText('Search sections...');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onNavigate).toHaveBeenCalledWith('work');
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
