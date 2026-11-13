'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function PortfolioEffects() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    const nav = document.querySelector<HTMLElement>('[data-site-nav]');
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let progressFrame: number | null = null;
    let cancelled = false;
    let lenis: Lenis | null = null;
    let gsap: typeof import('gsap').default | null = null;
    let scrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;
    let nativeScrollActive = true;

    const updateProgress = () => {
      if (progressFrame !== null) return;

      progressFrame = window.requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const value =
          scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        progress?.style.setProperty('--progress', `${value}%`);
        progress?.setAttribute('aria-valuenow', String(Math.round(value)));
        if (nav) nav.dataset.scrolled = String(window.scrollY > 80);
        progressFrame = null;
      });
    };

    const onLenisScroll = () => {
      scrollTrigger?.update();
      updateProgress();
    };
    const raf = (time: number) => lenis?.raf(time * 1000);

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    if (!reducedMotion) {
      void Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]).then(([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;
        gsap = gsapModule.default;
        scrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(scrollTrigger);
        lenis = new Lenis({ autoRaf: false });
        lenis.on('scroll', onLenisScroll);
        gsap.ticker.lagSmoothing(0);
        gsap.ticker.add(raf);
        window.removeEventListener('scroll', updateProgress);
        nativeScrollActive = false;
        updateProgress();
      });
    }

    return () => {
      cancelled = true;
      lenis?.off('scroll', onLenisScroll);
      lenis?.destroy();
      if (gsap) {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
      }
      if (nativeScrollActive) {
        window.removeEventListener('scroll', updateProgress);
      }
      window.removeEventListener('resize', updateProgress);
      if (progressFrame !== null) window.cancelAnimationFrame(progressFrame);
    };
  }, []);

  return (
    <>
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
      <div className="film-grain" aria-hidden="true" />
    </>
  );
}
