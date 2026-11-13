'use client';

import { useEffect, useRef } from 'react';
import { useFinePointer } from '@/hooks/useFinePointer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useFinePointer();

  useEffect(() => {
    const cursor = cursorRef.current;

    if (prefersReducedMotion || !hasFinePointer || !cursor) return;

    let frame: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let latestTarget: Element | null = null;
    let activeProject: HTMLElement | null = null;
    let activeProjectBounds: DOMRect | null = null;

    const resetProjectTilt = () => {
      if (!activeProject) return;

      const preview = activeProject.querySelector<HTMLElement>('.project-preview');
      preview?.style.setProperty('--tilt-x', '0deg');
      preview?.style.setProperty('--tilt-y', '0deg');
      preview?.style.setProperty('--parallax-x', '0px');
      preview?.style.setProperty('--parallax-y', '0px');
      activeProject = null;
      activeProjectBounds = null;
    };

    const animateCursor = () => {
      frame = null;
      const target = latestTarget;
      const isFormControl = Boolean(
        target?.closest('input, textarea, select, [contenteditable="true"]'),
      );
      cursor.dataset.nativeCursor = String(isFormControl);
      cursor.dataset.visible = String(!isFormControl);
      cursor.dataset.hover = target?.closest('a, button') ? 'interactive' : '';

      const project = target?.closest<HTMLElement>('[data-project-card]') ?? null;
      cursor.dataset.labelVisible = String(Boolean(project));

      if (isFormControl) {
        resetProjectTilt();
      } else if (project) {
        if (activeProject !== project) {
          resetProjectTilt();
          activeProject = project;
        }
        activeProjectBounds ??= project.getBoundingClientRect();
        const preview = project.querySelector<HTMLElement>('.project-preview');
        const bounds = activeProjectBounds;
        const tiltX = ((targetX - bounds.left) / bounds.width - 0.5) * 8;
        const tiltY = (0.5 - (targetY - bounds.top) / bounds.height) * 8;
        preview?.style.setProperty('--tilt-x', `${tiltX}deg`);
        preview?.style.setProperty('--tilt-y', `${tiltY}deg`);
        preview?.style.setProperty('--parallax-x', `${tiltX}px`);
        preview?.style.setProperty('--parallax-y', `${-tiltY}px`);
      } else {
        resetProjectTilt();
      }

      const dot = cursor.querySelector<HTMLElement>('.cursor-dot');
      const ring = cursor.querySelector<HTMLElement>('.cursor-ring');
      const label = cursor.querySelector<HTMLElement>('.cursor-label');
      dot?.style.setProperty(
        'transform',
        `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`,
      );
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      const ringTransform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      ring?.style.setProperty('transform', ringTransform);
      label?.style.setProperty('transform', ringTransform);

      if (Math.abs(targetX - ringX) > 0.2 || Math.abs(targetY - ringY) > 0.2) {
        frame = window.requestAnimationFrame(animateCursor);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      targetX = event.clientX;
      targetY = event.clientY;
      latestTarget = event.target instanceof Element ? event.target : null;

      if (frame === null) frame = window.requestAnimationFrame(animateCursor);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      cursor.dataset.visible = 'false';
      cursor.dataset.labelVisible = 'false';
      resetProjectTilt();
    };

    const invalidateProjectBounds = () => {
      activeProjectBounds = null;
    };

    document.documentElement.dataset.customCursor = 'true';
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('scroll', invalidateProjectBounds, { passive: true });
    window.addEventListener('resize', invalidateProjectBounds, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('scroll', invalidateProjectBounds);
      window.removeEventListener('resize', invalidateProjectBounds);
      if (frame !== null) window.cancelAnimationFrame(frame);
      delete document.documentElement.dataset.customCursor;
      resetProjectTilt();
    };
  }, [hasFinePointer, prefersReducedMotion]);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
      data-visible="false"
    >
      <span className="cursor-dot" />
      <span className="cursor-ring" />
      <span className="cursor-label">
        View <span className="cursor-label-arrow">↗</span>
      </span>
    </div>
  );
}
