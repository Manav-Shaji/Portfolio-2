import { ArrowUpRight, Mail } from 'lucide-react';
import { Marquee } from '@/components/ui/Marquee';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { site } from '@/data/site';
import { HeroAnimation } from './HeroAnimation';

export function Hero() {
  return (
    <>
      <HeroAnimation />
      <section className="relative py-[3.75rem] md:py-[5.25rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center">
          <div className="lg:col-span-2">
            <p className="hero-meta section-tag mb-6 flex items-center gap-3 text-[var(--accent-hover)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              Available for frontend &amp; full-stack roles
            </p>

            <h1 className="hero-heading font-semibold text-[#ededed]">
              <span className="hero-word block">
                I build thoughtful digital experiences for people and products.
              </span>
              <span className="hero-word hero-accent block">Reliable software.</span>
            </h1>
          </div>

          <div className="max-w-4xl">
            <p className="hero-actions mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)] md:text-xl">
              I’m Manav Shaji, a 2026 MCA graduate focused on creating clean interfaces, scalable
              products, and reliable engineering systems.
            </p>

            <div className="hero-actions mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#work"
                className="mint-cta premium-border inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm text-[#050505] transition-colors hover:bg-[var(--accent-hover)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)]"
              >
                View projects
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="premium-border inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                Let’s talk
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <div className="hero-actions mt-8 flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Find me on
              </span>
              <SocialLinks size="md" />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hero-terminal premium-border hidden min-h-[280px] w-full max-w-md justify-self-end rounded-3xl border border-[rgba(126,240,192,0.22)] bg-[#0b100e] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:block"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f7c66a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">interface.tsx</span>
            </div>
            <div className="mt-6 space-y-3 font-mono text-[13px] leading-6">
              <p>
                <span className="text-[#d29eff]">const</span> interface = {'{'}
              </p>
              <p className="pl-5">
                <span className="text-[#9bd9ff]">responsive</span>:{' '}
                <span className="text-[var(--accent)]">true</span>,
              </p>
              <p className="pl-5">
                <span className="text-[#9bd9ff]">accessible</span>:{' '}
                <span className="text-[var(--accent)]">true</span>,
              </p>
              <p className="pl-5">
                <span className="text-[#9bd9ff]">builtWithCare</span>:{' '}
                <span className="text-[var(--accent)]">true</span>
              </p>
              <p>{'}'}</p>
              <p className="pt-2 text-[var(--text-muted)]">
                <span className="text-[var(--accent)]">build</span>(interface);
                <span className="terminal-cursor ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[var(--accent)]" />
              </p>
            </div>
          </div>
        </div>
      </section>
      <Marquee items={site.marquee} />
    </>
  );
}
