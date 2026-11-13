'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function FooterReveal({ children }: Props) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!footer || reducedMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    footer.dataset.revealReady = 'true';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        footer.dataset.visible = 'true';
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="gradient-divider footer-reveal">
      {children}
    </footer>
  );
}
