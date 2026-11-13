'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function HeroAnimation() {
  const introRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.getElementById('home');
    const introElement = introRef.current;
    if (prefersReducedMotion || !root) return;

    let hasVisited = false;
    try {
      hasVisited = window.sessionStorage.getItem('portfolio-intro-seen') !== null;
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      hasVisited = true;
    }

    if (hasVisited) return;

    root.dataset.heroIntro = 'true';
    if (introElement) {
      introElement.dataset.active = 'true';
    }

    const introTimeout = window.setTimeout(() => {
      delete root.dataset.heroIntro;
      if (introElement) introElement.dataset.active = 'false';
      try {
        window.sessionStorage.setItem('portfolio-intro-seen', 'true');
      } catch (error) {
        if (!(error instanceof DOMException)) throw error;
      }
    }, 1200);

    return () => {
      window.clearTimeout(introTimeout);
      delete root.dataset.heroIntro;
      if (introElement) introElement.dataset.active = 'false';
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={introRef}
      className="intro-screen"
      aria-hidden="true"
      data-active="false"
    >
      <span>initializing portfolio...</span>
    </div>
  );
}
