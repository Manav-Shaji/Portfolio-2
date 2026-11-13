import { site } from '../data/site';

const marqueeItems = [...site.marquee, ...site.marquee];

export function Marquee() {
  return (
    <div className="tech-marquee" aria-hidden="true">
      <div className="tech-marquee-track">
        {marqueeItems.map((technology, index) => (
          <span className="tech-marquee-item" key={`${technology}-${index}`}>
            {technology}
          </span>
        ))}
      </div>
    </div>
  );
}
