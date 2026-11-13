'use client';

import { useEffect, useRef } from 'react';

export function HeroAnimation() {
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const introElement = introRef.current;
    const reducedMotion =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let hasVisited = false;
    try {
      hasVisited = window.sessionStorage.getItem('portfolio-intro-seen') !== null;
      if (!hasVisited) {
        window.sessionStorage.setItem('portfolio-intro-seen', 'true');
      }
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      hasVisited = true;
    }

    if (!hasVisited && introElement) {
      introElement.dataset.active = 'true';
    }

    let cancelled = false;
    let revertAnimation: (() => void) | undefined;
    let cancelIntro: (() => void) | undefined;
    void import('gsap').then(({ default: gsap }) => {
      if (cancelled) return;

      const root = document.getElementById('home');
      if (!root) return;

      const context = gsap.context(() => {
        gsap.from('.hero-word', {
          y: 32,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        });
        gsap.from('.hero-meta, .hero-actions', {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
        });

        if (!hasVisited) {
          const intro = gsap.delayedCall(1.2, () => {
            if (introElement) introElement.dataset.active = 'false';
          });
          cancelIntro = () => intro.kill();
        }
      }, root);
      revertAnimation = () => context.revert();
    });

    return () => {
      cancelled = true;
      cancelIntro?.();
      revertAnimation?.();
      if (introElement) introElement.dataset.active = 'false';
    };
  }, []);

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
