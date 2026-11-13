'use client';

import { useEffect, useRef } from 'react';

type Props = {
  items: readonly string[];
};

export function Marquee({ items }: Props) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    if (typeof IntersectionObserver === 'undefined') {
      marquee.dataset.visible = 'true';
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      marquee.dataset.visible = String(entry?.isIntersecting ?? false);
    });
    observer.observe(marquee);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="tech-marquee"
      aria-hidden="true"
      data-visible="false"
    >
      <div className="tech-marquee-track">
        {[...items, ...items].map((technology, index) => (
          <span className="tech-marquee-item" key={`${technology}-${index}`}>
            {technology}
          </span>
        ))}
      </div>
    </div>
  );
}
