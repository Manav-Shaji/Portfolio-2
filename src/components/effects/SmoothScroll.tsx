'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { setLenisInstance } from '@/lib/scroll';

export function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let cancelled = false;
    let lenis: Lenis | null = null;
    let gsap: typeof import('gsap').default | null = null;
    let scrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

    const handleScroll = () => {
      scrollTrigger?.update();
      window.dispatchEvent(new Event('lenis-scroll'));
    };
    const raf = (time: number) => lenis?.raf(time * 1000);

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        gsap = gsapModule.default;
        scrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(scrollTrigger);
        lenis = new Lenis({ autoRaf: false });
        setLenisInstance(lenis);
        lenis.on('scroll', handleScroll);
        gsap.ticker.lagSmoothing(0);
        gsap.ticker.add(raf);
      },
    );

    return () => {
      cancelled = true;
      if (lenis) {
        setLenisInstance(null);
        lenis.off('scroll', handleScroll);
        lenis.destroy();
      }
      if (gsap) {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
      }
    };
  }, [prefersReducedMotion]);

  return null;
}
