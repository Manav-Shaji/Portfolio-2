'use client';

import { useEffect, useRef } from 'react';
import { useFinePointer } from '@/hooks/useFinePointer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useFinePointer();

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    if (prefersReducedMotion || !hasFinePointer || !cursor || !dot || !ring || !label) return;

    let cursorFrame: number | null = null;
    let hoverFrame: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let latestTarget: Element | null = null;
    let activeProject: HTMLElement | null = null;

    const resetProjectTilt = () => {
      if (!activeProject) return;

      const preview = activeProject.querySelector<HTMLElement>('.project-preview');
      preview?.style.setProperty('--tilt-x', '0deg');
      preview?.style.setProperty('--tilt-y', '0deg');
      preview?.style.setProperty('--parallax-x', '0px');
      preview?.style.setProperty('--parallax-y', '0px');
      activeProject = null;
    };

    const updatePointerState = () => {
      hoverFrame = null;
      const target = latestTarget;
      if (!target) {
        cursor.dataset.nativeCursor = 'false';
        cursor.dataset.visible = 'false';
        cursor.dataset.hover = '';
        cursor.dataset.labelVisible = 'false';
        resetProjectTilt();
        return;
      }

      const isFormControl = Boolean(
        target.closest('input, textarea, select, [contenteditable="true"]'),
      );
      cursor.dataset.nativeCursor = String(isFormControl);
      cursor.dataset.visible = String(!isFormControl);
      cursor.dataset.hover = target.closest('a, button') ? 'interactive' : '';

      const project =
        target.closest<HTMLElement>('[data-project-card][data-has-link="true"]');
      cursor.dataset.labelVisible = String(Boolean(project));

      if (isFormControl) {
        resetProjectTilt();
      } else if (project) {
        if (activeProject !== project) {
          resetProjectTilt();
          activeProject = project;
        }
        const bounds = project.getBoundingClientRect();
        const preview = project.querySelector<HTMLElement>('.project-preview');
        const tiltX = ((targetX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 8;
        const tiltY = (0.5 - (targetY - bounds.top) / Math.max(bounds.height, 1)) * 8;
        preview?.style.setProperty('--tilt-x', `${tiltX}deg`);
        preview?.style.setProperty('--tilt-y', `${tiltY}deg`);
        preview?.style.setProperty('--parallax-x', `${tiltX}px`);
        preview?.style.setProperty('--parallax-y', `${-tiltY}px`);
      } else {
        resetProjectTilt();
      }
    };

    const animateCursor = () => {
      cursorFrame = null;
      dot.style.setProperty(
        'transform',
        `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`,
      );
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      const ringTransform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      ring.style.setProperty('transform', ringTransform);
      label.style.setProperty('transform', ringTransform);

      if (Math.abs(targetX - ringX) > 0.2 || Math.abs(targetY - ringY) > 0.2) {
        cursorFrame = window.requestAnimationFrame(animateCursor);
      }
    };

    const schedulePointerStateUpdate = () => {
      if (hoverFrame === null) {
        hoverFrame = window.requestAnimationFrame(updatePointerState);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      targetX = event.clientX;
      targetY = event.clientY;
      latestTarget = event.target instanceof Element ? event.target : null;

      schedulePointerStateUpdate();
      if (cursorFrame === null) cursorFrame = window.requestAnimationFrame(animateCursor);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      latestTarget = null;
      if (hoverFrame !== null) {
        window.cancelAnimationFrame(hoverFrame);
        hoverFrame = null;
      }
      cursor.dataset.nativeCursor = 'false';
      cursor.dataset.visible = 'false';
      cursor.dataset.labelVisible = 'false';
      cursor.dataset.hover = '';
      resetProjectTilt();
    };

    document.documentElement.dataset.customCursor = 'true';
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('scroll', schedulePointerStateUpdate, { passive: true });
    window.addEventListener('resize', schedulePointerStateUpdate, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('scroll', schedulePointerStateUpdate);
      window.removeEventListener('resize', schedulePointerStateUpdate);
      if (cursorFrame !== null) window.cancelAnimationFrame(cursorFrame);
      if (hoverFrame !== null) window.cancelAnimationFrame(hoverFrame);
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
      <span ref={dotRef} className="cursor-dot" />
      <span ref={ringRef} className="cursor-ring" />
      <span ref={labelRef} className="cursor-label">
        View <span className="cursor-label-arrow">↗</span>
      </span>
    </div>
  );
}
