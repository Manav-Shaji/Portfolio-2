import { Sparkles } from 'lucide-react';
import { Reveal } from '@/components/effects/Reveal';
import { AboutParagraph } from './AboutParagraph';
import { aboutStatement, introStats } from '@/data/site';

export function About() {
  return (
    <section id="about" className="py-[4.5rem] md:py-[5.25rem]">
      <div className="mb-8 flex flex-col items-start gap-2">
        <span className="section-tag">01</span>
        <h2 className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">
          <Reveal variant="mask" as="span" underline>
            <span className="section-title-word section-title-keyword">About</span>
          </Reveal>
        </h2>
      </div>
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <AboutParagraph text={aboutStatement} />
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
            <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
              Performance-first
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
              Accessible interfaces
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
              Pragmatic engineering
            </span>
          </div>
        </div>

        <div className="premium-border premium-card rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(126,240,192,0.1)] text-[var(--accent-hover)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Current focus</p>
              <p className="mt-1 text-lg font-medium text-[var(--text)]">
                Full-stack product work
              </p>
            </div>
          </div>
          <ul className="mt-6 space-y-4 text-sm text-[var(--text-muted)]">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
              Building responsive interfaces with a strong eye for usability and detail.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
              Connecting front-end design to backend data flows and production constraints.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
              Improving workflow clarity through cleaner architecture and thoughtful iteration.
            </li>
          </ul>
        </div>
      </div>

      <Reveal
        variant="stagger"
        className="gradient-divider mt-8 grid gap-4 pt-6 sm:grid-cols-3"
      >
        {introStats.map(([label, value]) => (
          <div
            key={label}
            className="premium-border premium-card rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4"
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {label}
            </p>
            <p className="mt-2 text-lg font-medium text-[var(--text)]">{value}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
