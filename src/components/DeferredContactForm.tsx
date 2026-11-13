'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { ContactFormFallback } from './ContactFormFallback';

const ContactForm = dynamic(
  () => import('./ContactForm').then((module) => module.ContactForm),
  { ssr: false, loading: () => <ContactFormFallback /> },
);

export function DeferredContactForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '500px 0px' },
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {isNearViewport ? <ContactForm /> : <ContactFormFallback />}
    </div>
  );
}
