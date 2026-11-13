'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const ContactForm = dynamic(
  () => import('./ContactForm').then((module) => module.ContactForm),
  { ssr: false, loading: () => <ContactFormPlaceholder /> },
);

function ContactFormPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="premium-border premium-card min-h-[480px] rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)]"
    />
  );
}

export function ContactFormLoader() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder || shouldLoad) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setShouldLoad(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setShouldLoad(true);
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={placeholderRef} className="min-h-[480px]">
      {shouldLoad ? <ContactForm /> : <ContactFormPlaceholder />}
    </div>
  );
}
