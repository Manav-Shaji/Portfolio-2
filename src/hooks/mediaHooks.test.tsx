import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFinePointer } from './useFinePointer';
import { useIsDesktop } from './useIsDesktop';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const finePointerQuery = '(hover: hover) and (pointer: fine)';
const desktopQuery = '(min-width: 1024px)';
const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');

type TestMediaQuery = {
  mediaQueryList: MediaQueryList;
  setMatches: (matches: boolean) => void;
};

function createTestMediaQuery(query: string, initialMatches: boolean): TestMediaQuery {
  let matches = initialMatches;
  const eventTarget = new EventTarget();
  const mediaQueryList = eventTarget as MediaQueryList;
  Object.defineProperties(mediaQueryList, {
    media: { value: query },
    matches: { get: () => matches },
    onchange: { value: null, writable: true },
    addListener: { value: () => undefined },
    removeListener: { value: () => undefined },
  });

  return {
    mediaQueryList,
    setMatches(nextMatches) {
      matches = nextMatches;
      eventTarget.dispatchEvent(new window.Event('change'));
    },
  };
}

function installMediaQueries(records: Record<string, boolean>) {
  const mediaQueries = new Map(
    Object.entries(records).map(([query, matches]) => [
      query,
      createTestMediaQuery(query, matches),
    ]),
  );
  const matchMedia = (query: string) => {
    const mediaQuery = mediaQueries.get(query);
    if (!mediaQuery) throw new Error(`Unexpected media query: ${query}`);
    return mediaQuery.mediaQueryList;
  };
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: matchMedia,
  });
  return mediaQueries;
}

function ReducedMotionProbe() {
  return <output>{String(usePrefersReducedMotion())}</output>;
}

function FinePointerProbe() {
  return <output>{String(useFinePointer())}</output>;
}

function DesktopProbe() {
  return <output>{String(useIsDesktop())}</output>;
}

afterEach(() => {
  if (originalMatchMedia) {
    Object.defineProperty(window, 'matchMedia', originalMatchMedia);
  } else {
    Reflect.deleteProperty(window, 'matchMedia');
  }
  vi.unstubAllGlobals();
});

describe('media query hooks', () => {
  it('uses false server snapshots for reduced motion, fine pointer, and desktop', () => {
    installMediaQueries({
      [reducedMotionQuery]: true,
      [finePointerQuery]: true,
      [desktopQuery]: true,
    });

    expect(
      renderToString(
        <div>
          <ReducedMotionProbe />
          <FinePointerProbe />
          <DesktopProbe />
        </div>,
      ),
    ).toBe('<div><output>false</output><output>false</output><output>false</output></div>');
  });

  it('subscribes to reduced-motion preference changes', () => {
    const queries = installMediaQueries({ [reducedMotionQuery]: false });
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
    act(() => queries.get(reducedMotionQuery)?.setMatches(true));
    expect(result.current).toBe(true);
  });

  it('subscribes to fine-pointer capability changes', () => {
    const queries = installMediaQueries({ [finePointerQuery]: false });
    const { result } = renderHook(() => useFinePointer());

    expect(result.current).toBe(false);
    act(() => queries.get(finePointerQuery)?.setMatches(true));
    expect(result.current).toBe(true);
  });

  it('subscribes to desktop breakpoint changes', () => {
    const queries = installMediaQueries({ [desktopQuery]: false });
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);
    act(() => queries.get(desktopQuery)?.setMatches(true));
    expect(result.current).toBe(true);
  });
});
