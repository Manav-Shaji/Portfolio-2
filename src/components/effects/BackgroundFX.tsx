'use client';

import { useEffect, useRef } from 'react';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const lineNumbers = Array.from({ length: 40 }, (_, index) =>
  String(index + 1).padStart(2, '0'),
);

const codeSnippets = [
  "git commit -m 'ship it'",
  'npm run dev',
  'const build = () => ship()',
  '200 OK',
];

export function BackgroundFX() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useFinePointer();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const background = backgroundRef.current;
    const hero = document.querySelector<HTMLElement>('#home > section');

    if (!background) {
      return;
    }

    let animationFrame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;
    const heroObserver = hero && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          if (entry) {
            background.dataset.heroVisible = String(entry.isIntersecting);
            hero.dataset.heroVisible = String(entry.isIntersecting);
          }
        })
      : null;

    if (hero && heroObserver) {
      heroObserver.observe(hero);
    } else if (hero) {
      background.dataset.heroVisible = 'true';
      hero.dataset.heroVisible = 'true';
    }

    const updatePageVisibility = () => {
      document.documentElement.dataset.pageHidden = String(document.hidden);
    };

    updatePageVisibility();
    document.addEventListener('visibilitychange', updatePageVisibility);

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;

      if (animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        background.style.setProperty('--mx', `${pointerX}px`);
        background.style.setProperty('--my', `${pointerY}px`);
        background.dataset.pointerActive = 'true';
        animationFrame = null;
      });
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) {
        return;
      }

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      background.dataset.pointerActive = 'false';
    };

    const shouldTrackPointer = hasFinePointer && isDesktop && !prefersReducedMotion;

    if (shouldTrackPointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerout', handlePointerOut, { passive: true });
    }

    return () => {
      heroObserver?.disconnect();
      document.removeEventListener('visibilitychange', updatePageVisibility);
      delete document.documentElement.dataset.pageHidden;

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
    };
  }, [hasFinePointer, isDesktop, prefersReducedMotion]);

  return (
    <div
      ref={backgroundRef}
      className="background-fx"
      aria-hidden="true"
      data-hero-visible="false"
      data-pointer-active="false"
    >
      <div className="background-dot-grid" />
      <div className="background-spotlight" />
      <div className="background-vignette" />
      <div className="background-hero-details">
        <div className="background-hero-glow" />
        <div className="background-line-numbers">
          {lineNumbers.map((lineNumber) => (
            <span key={lineNumber}>{lineNumber}</span>
          ))}
        </div>
        <div className="background-code-snippets">
          {codeSnippets.map((snippet) => (
            <span className="background-code-snippet" key={snippet}>
              {snippet}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
