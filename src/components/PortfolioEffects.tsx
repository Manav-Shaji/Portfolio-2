'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export function PortfolioEffects() {
  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    const cursor = cursorRef.current;
    const nav = document.querySelector<HTMLElement>('[data-site-nav]');
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const finePointer =
      window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
    let progressFrame: number | null = null;
    let cursorFrame: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let activeProject: HTMLElement | null = null;

    const updateProgress = () => {
      if (progressFrame !== null) {
        return;
      }

      progressFrame = window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const value = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        progress?.style.setProperty('--progress', `${value}%`);
        progress?.setAttribute('aria-valuenow', String(Math.round(value)));
        if (nav) {
          nav.dataset.scrolled = String(window.scrollY > 80);
        }
        progressFrame = null;
      });
    };

    const hasMotionQuery = typeof window.matchMedia === 'function';
    const lenis =
      reducedMotion || !hasMotionQuery ? null : new Lenis({ autoRaf: false });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time: number) => lenis?.raf(time * 1000);

    if (lenis) {
      lenis.on('scroll', updateScrollTrigger);
      lenis.on('scroll', updateProgress);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(raf);
    } else {
      window.addEventListener('scroll', updateProgress, { passive: true });
    }

    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    const animateCursor = () => {
      const cursorDot = cursor?.querySelector<HTMLElement>('.cursor-dot');
      const cursorRing = cursor?.querySelector<HTMLElement>('.cursor-ring');

      cursorDot?.style.setProperty(
        'transform',
        `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`,
      );
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing?.style.setProperty(
        'transform',
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`,
      );
      const cursorLabel = cursor?.querySelector<HTMLElement>('.cursor-label');
      cursorLabel?.style.setProperty(
        'transform',
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`,
      );

      if (Math.abs(targetX - ringX) > 0.2 || Math.abs(targetY - ringY) > 0.2) {
        cursorFrame = window.requestAnimationFrame(animateCursor);
      } else {
        cursorFrame = null;
      }
    };

    const resetProjectTilt = () => {
      if (!activeProject) {
        return;
      }

      const preview = activeProject.querySelector<HTMLElement>('.project-preview');
      preview?.style.setProperty('--tilt-x', '0deg');
      preview?.style.setProperty('--tilt-y', '0deg');
      preview?.style.setProperty('--parallax-x', '0px');
      preview?.style.setProperty('--parallax-y', '0px');
      activeProject = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!cursor || event.pointerType === 'touch') {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const isFormControl = Boolean(target?.closest('input, textarea, select, [contenteditable="true"]'));

      cursor.dataset.nativeCursor = String(isFormControl);
      cursor.dataset.visible = String(!isFormControl);
      cursor.dataset.hover = target?.closest('a, button') ? 'interactive' : '';
      cursor.dataset.labelVisible = String(Boolean(target?.closest('[data-project-card]')));

      if (isFormControl) {
        resetProjectTilt();
        return;
      }

      targetX = event.clientX;
      targetY = event.clientY;

      const project = target?.closest<HTMLElement>('[data-project-card]') ?? null;
      if (project) {
        if (activeProject && activeProject !== project) {
          resetProjectTilt();
        }
        activeProject = project;
        const preview = project.querySelector<HTMLElement>('.project-preview');
        const bounds = project.getBoundingClientRect();
        const tiltX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
        const tiltY = (0.5 - (event.clientY - bounds.top) / bounds.height) * 8;
        preview?.style.setProperty('--tilt-x', `${tiltX}deg`);
        preview?.style.setProperty('--tilt-y', `${tiltY}deg`);
        preview?.style.setProperty('--parallax-x', `${tiltX}px`);
        preview?.style.setProperty('--parallax-y', `${-tiltY}px`);
      } else {
        resetProjectTilt();
      }

      if (cursorFrame === null) {
        cursorFrame = window.requestAnimationFrame(animateCursor);
      }
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) {
        return;
      }

      if (cursor) {
        cursor.dataset.visible = 'false';
        cursor.dataset.labelVisible = 'false';
      }
      resetProjectTilt();
    };

    if (!reducedMotion && finePointer && cursor) {
      document.documentElement.dataset.customCursor = 'true';
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerout', handlePointerOut, { passive: true });
    }

    return () => {
      lenis?.off('scroll', updateScrollTrigger);
      lenis?.off('scroll', updateProgress);
      lenis?.destroy();
      if (lenis) {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
      } else {
        window.removeEventListener('scroll', updateProgress);
      }
      window.removeEventListener('resize', updateProgress);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
      if (progressFrame !== null) {
        window.cancelAnimationFrame(progressFrame);
      }
      if (cursorFrame !== null) {
        window.cancelAnimationFrame(cursorFrame);
      }
      delete document.documentElement.dataset.customCursor;
      resetProjectTilt();
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
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" data-visible="false">
        <span className="cursor-dot" />
        <span className="cursor-ring" />
        <span className="cursor-label">
          View <span className="cursor-label-arrow">↗</span>
        </span>
      </div>
    </>
  );
}
