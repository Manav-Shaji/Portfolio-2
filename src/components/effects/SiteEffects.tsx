'use client';

import dynamic from 'next/dynamic';
import { useFinePointer } from '@/hooks/useFinePointer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

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
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useFinePointer();
  const enableCursor = !prefersReducedMotion && hasFinePointer;

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
