'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BackgroundFX = dynamic(
  () => import('./BackgroundFX').then((module) => module.BackgroundFX),
  { loading: () => null },
);
const SmoothScroll = dynamic(
  () => import('./SmoothScroll').then((module) => module.SmoothScroll),
  { loading: () => null },
);
const ScrollProgress = dynamic(
  () => import('./ScrollProgress').then((module) => module.ScrollProgress),
  { loading: () => null },
);
const CustomCursor = dynamic(
  () => import('./CustomCursor').then((module) => module.CustomCursor),
  { ssr: false, loading: () => null },
);

export function SiteEffects() {
  const [enableCursor, setEnableCursor] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const updateCursorAvailability = () => {
      const reducedMotion =
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const finePointer =
        window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
      setEnableCursor(!reducedMotion && finePointer);
    };

    updateCursorAvailability();
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    reducedMotionQuery.addEventListener('change', updateCursorAvailability);
    finePointerQuery.addEventListener('change', updateCursorAvailability);

    return () => {
      reducedMotionQuery.removeEventListener('change', updateCursorAvailability);
      finePointerQuery.removeEventListener('change', updateCursorAvailability);
    };
  }, []);

  return (
    <>
      <BackgroundFX />
      <SmoothScroll />
      <ScrollProgress />
      {enableCursor && <CustomCursor />}
      <div className="film-grain" aria-hidden="true" />
    </>
  );
}
