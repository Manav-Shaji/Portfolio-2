'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type RevealVariant = 'fade' | 'fade-up' | 'stagger' | 'mask' | 'clip';

type Props = {
  variant: RevealVariant;
  as?: 'div' | 'span' | 'ul' | 'footer';
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  parallax?: boolean;
  underline?: boolean;
  'aria-hidden'?: boolean;
};

const duration = 0.7;
let fontRefreshScheduled = false;

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (progress: number) => {
    let lower = 0;
    let upper = 1;
    let parameter = progress;

    for (let iteration = 0; iteration < 8; iteration += 1) {
      const inverse = 1 - parameter;
      const x =
        3 * inverse * inverse * parameter * x1 +
        3 * inverse * parameter * parameter * x2 +
        parameter * parameter * parameter;

      if (Math.abs(x - progress) < 0.001) {
        break;
      }

      if (x < progress) {
        lower = parameter;
      } else {
        upper = parameter;
      }
      parameter = (lower + upper) / 2;
    }

    const inverse = 1 - parameter;
    return (
      3 * inverse * inverse * parameter * y1 +
      3 * inverse * parameter * parameter * y2 +
      parameter * parameter * parameter
    );
  };
}

const revealEase = cubicBezier(0.22, 1, 0.36, 1);

function refreshAfterFontsLoad() {
  if (fontRefreshScheduled) {
    return;
  }

  fontRefreshScheduled = true;
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh()),
    );
  }
}

export function Reveal({
  variant,
  as = 'div',
  children,
  className = '',
  staggerDelay = 0.08,
  parallax = false,
  underline = false,
  'aria-hidden': ariaHidden,
}: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const maskContentRef = useRef<HTMLSpanElement | null>(null);
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const parallaxContentRef = useRef<HTMLDivElement | null>(null);
  const setRootRef = useCallback((element: HTMLElement | null) => {
    rootRef.current = element;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion || typeof IntersectionObserver === 'undefined') return;

    let cancelled = false;
    let revertAnimation: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
          ([gsapModule, scrollTriggerModule]) => {
            if (cancelled) return;
            const gsap = gsapModule.default;
            const { ScrollTrigger } = scrollTriggerModule;
            gsap.registerPlugin(ScrollTrigger);
            const scrollTrigger = {
              trigger: root,
              start: 'top 85%',
              once: true,
            };

            const context = gsap.context(() => {
              if (variant === 'fade') {
                gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' });
              } else if (variant === 'fade-up') {
                gsap.fromTo(
                  root,
                  { opacity: 0, y: 32 },
                  { opacity: 1, y: 0, duration, ease: revealEase, scrollTrigger },
                );
              } else if (variant === 'stagger') {
                const targets = Array.from(root.children);
                if (targets.length > 0) {
                  gsap.fromTo(
                    targets,
                    { opacity: 0, y: 32 },
                    {
                      opacity: 1,
                      y: 0,
                      duration,
                      ease: revealEase,
                      stagger: staggerDelay,
                      scrollTrigger,
                    },
                  );
                }
              } else if (variant === 'mask') {
                const timeline = gsap.timeline({ scrollTrigger });
                if (maskContentRef.current) {
                  timeline.fromTo(
                    maskContentRef.current,
                    { yPercent: 110 },
                    { yPercent: 0, duration, ease: revealEase },
                  );
                }
                if (underline && underlineRef.current) {
                  timeline.fromTo(
                    underlineRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, duration, ease: revealEase },
                    0,
                  );
                }
              } else {
                gsap.fromTo(
                  root,
                  { clipPath: 'inset(0 0 100% 0)' },
                  {
                    clipPath: 'inset(0 0 0% 0)',
                    duration,
                    ease: revealEase,
                    scrollTrigger,
                  },
                );

                if (parallax && parallaxContentRef.current) {
                  gsap.fromTo(
                    parallaxContentRef.current,
                    { y: -20 },
                    {
                      y: 20,
                      ease: 'none',
                      scrollTrigger: {
                        trigger: root,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                      },
                    },
                  );
                }
              }
            }, root);

            revertAnimation = () => context.revert();
            refreshAfterFontsLoad();
          },
        );
      },
      { threshold: 0.15 },
    );

    observer.observe(root);
    return () => {
      cancelled = true;
      observer.disconnect();
      revertAnimation?.();
    };
  }, [parallax, prefersReducedMotion, staggerDelay, underline, variant]);

  const content =
    variant === 'mask' ? (
      <>
        <span className="reveal-mask-line">
          <span ref={maskContentRef} className="reveal-mask-content">
            {children}
          </span>
        </span>
        {underline && (
          <span
            ref={underlineRef}
            className="reveal-heading-rule"
            aria-hidden="true"
          />
        )}
      </>
    ) : variant === 'clip' && parallax ? (
      <div ref={parallaxContentRef} className="block w-full">
        {children}
      </div>
    ) : (
      children
    );

  const elementProps = {
    ref: setRootRef,
    className: `${variant === 'mask' ? 'reveal-mask' : ''} ${className}`.trim(),
    'aria-hidden': ariaHidden,
    'data-reveal': variant,
  };

  if (as === 'span') {
    return <span {...elementProps}>{content}</span>;
  }
  if (as === 'ul') {
    return <ul {...elementProps}>{content}</ul>;
  }
  if (as === 'footer') {
    return <footer {...elementProps}>{content}</footer>;
  }

  return <div {...elementProps}>{content}</div>;
}
