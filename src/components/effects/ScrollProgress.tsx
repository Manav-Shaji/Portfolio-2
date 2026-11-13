'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    const nav = document.querySelector<HTMLElement>('[data-site-nav]');
    let progressFrame: number | null = null;

    const updateProgress = () => {
      if (progressFrame !== null) return;

      progressFrame = window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const value = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        progress?.style.setProperty('--progress', `${value}%`);
        progress?.setAttribute('aria-valuenow', String(Math.round(value)));
        if (nav) nav.dataset.scrolled = String(window.scrollY > 80);
        progressFrame = null;
      });
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('lenis-scroll', updateProgress);
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('lenis-scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (progressFrame !== null) window.cancelAnimationFrame(progressFrame);
    };
  }, []);

  return (
    <div
      ref={progressRef}
      className="page-progress"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <span />
    </div>
  );
}
