'use client';

import { useEffect, useRef } from 'react';

type Props = {
  text: string;
};

export function AboutParagraph({ text }: Props) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!paragraph || reducedMotion) return;

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
            const words = paragraph.querySelectorAll<HTMLElement>('.about-scroll-word');
            const context = gsap.context(() => {
              gsap.fromTo(
                words,
                { opacity: 0.25 },
                {
                  opacity: 1,
                  ease: 'none',
                  stagger: 0.01,
                  scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    scrub: true,
                  },
                },
              );
            }, paragraph);

            revertAnimation = () => context.revert();
            ScrollTrigger.refresh();
          },
        );
      },
      { threshold: 0.15 },
    );

    observer.observe(paragraph);
    return () => {
      cancelled = true;
      observer.disconnect();
      revertAnimation?.();
    };
  }, []);

  const words = text.split(' ');

  return (
    <p
      ref={paragraphRef}
      className="about-scroll-paragraph max-w-xl text-lg leading-8 text-[var(--text-muted)]"
    >
      {words.map((word, index) => (
        <span className="about-scroll-word" key={`${word}-${index}`}>
          {word}{index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
