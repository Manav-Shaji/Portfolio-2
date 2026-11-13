import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { AboutParagraph } from '../components/AboutParagraph';
import { ContactInfoCard } from '../components/ContactInfoCard';
import { DeferredContactForm } from '../components/DeferredContactForm';
import { EffectsLayer } from '../components/EffectsLayer';
import { FooterReveal } from '../components/FooterReveal';
import { HeroAnimation } from '../components/HeroAnimation';
import { Marquee } from '../components/Marquee';
import { Navigation } from '../components/Navigation';
import { Reveal } from '../components/Reveal';
import { SocialLinks } from '../components/SocialLinks';
import {
  aboutStatement,
  introStats,
  projectCards,
  skillGroups,
  site,
} from '../data/site';
import { navItems } from '../data/navigation';

export default function HomePage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-[var(--text)]">
      <EffectsLayer />
      <Navigation />

      <main id="home" className="mx-auto max-w-6xl px-4 pb-0 md:px-6">
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
                I’m Manav Shaji, a 2026 MCA graduate focused on creating clean interfaces, scalable products, and reliable engineering systems.
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
                <p><span className="text-[#d29eff]">const</span> interface = {'{'}</p>
                <p className="pl-5"><span className="text-[#9bd9ff]">responsive</span>: <span className="text-[var(--accent)]">true</span>,</p>
                <p className="pl-5"><span className="text-[#9bd9ff]">accessible</span>: <span className="text-[var(--accent)]">true</span>,</p>
                <p className="pl-5"><span className="text-[#9bd9ff]">builtWithCare</span>: <span className="text-[var(--accent)]">true</span></p>
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
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Performance-first</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Accessible interfaces</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Pragmatic engineering</span>
              </div>
            </div>

            <div className="premium-border premium-card rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(126,240,192,0.1)] text-[var(--accent-hover)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Current focus</p>
                  <p className="mt-1 text-lg font-medium text-[var(--text)]">Full-stack product work</p>
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
              <div key={label} className="premium-border premium-card rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
                <p className="mt-2 text-lg font-medium text-[var(--text)]">{value}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="work" className="py-[4.5rem] md:py-[5.25rem]">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2
              aria-label="Work"
              className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
            >
              <span className="sr-only" aria-hidden="true">02 — Work</span>
              <Reveal variant="mask" as="span" underline>
                <span className="section-index" aria-hidden="true">02 — </span>
                <span className="section-title-word section-title-keyword">Work</span>
              </Reveal>
            </h2>
          </div>

          <Reveal variant="stagger" className="grid gap-5 lg:grid-cols-3">
            {projectCards.map((project) => (
              <article
                key={project.name}
                data-project-card
                className="premium-border premium-card project-card group overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.01)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="grid gap-5 p-5 md:grid-cols-[0.7fr_1.3fr] md:p-7 lg:grid-cols-1">
                  <div className="project-visual">
                    <Reveal
                      variant="clip"
                      className="project-preview-clip"
                      parallax
                      aria-hidden={true}
                    >
                      <div className="project-preview" aria-hidden="true">
                        <div className="preview-window">
                          <div className="preview-toolbar">
                            <span className="preview-dots"><i /><i /><i /></span>
                            <span className="preview-toolbar-mark" />
                          </div>
                          <div className="preview-dashboard">
                            <div className="preview-sidebar">
                              <i /><i /><i /><i />
                            </div>
                            <div className="preview-content">
                              <span className="preview-skeleton preview-skeleton-title" />
                              <div className="preview-metrics"><i /><i /><i /></div>
                              <div className="preview-chart">
                                <svg viewBox="0 0 240 64" preserveAspectRatio="none">
                                  <path d="M2 54 C28 47 36 52 58 38 S91 41 112 27 143 37 164 21 196 26 238 7" />
                                </svg>
                              </div>
                              <span className="preview-skeleton preview-skeleton-row" />
                              <span className="preview-skeleton preview-skeleton-row preview-skeleton-short" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="text-xl font-semibold text-[var(--text)]">{project.name}</span>
                      <ArrowUpRight className="h-4 w-4 text-[var(--accent-hover)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{project.type}</p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">Case study</p>
                      <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{project.summary}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span key={item} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
        </section>

        <section id="skills" className="py-[4.5rem] md:py-[5.25rem]">
          <div className="mb-8 flex items-center gap-3">
            <h2
              aria-label="Skills"
              className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
            >
              <Reveal variant="mask" as="span" underline>
                <span className="section-index" aria-hidden="true">03 — </span>
                <span className="section-title-word section-title-keyword">Skills</span>
              </Reveal>
            </h2>
          </div>

          <Reveal variant="stagger" className="grid gap-5 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.title} className="premium-border premium-card rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] text-[var(--accent-hover)]">
                    {group.title === 'Frontend' ? (
                      <Code2 className="h-4 w-4" />
                    ) : group.title === 'Backend' ? (
                      <BriefcaseBusiness className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text)]">{group.title}</h3>
                </div>
                <Reveal
                  as="ul"
                  variant="stagger"
                  className="space-y-3 text-sm text-[var(--text-muted)]"
                  staggerDelay={0.04}
                >
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)] pb-2 last:border-b-0 last:pb-0">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </Reveal>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="contact" className="py-[4.5rem] md:py-[5.25rem]">
          <div className="mb-8 flex items-center gap-3">
            <h2
              aria-label="Contact"
              className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
            >
              <Reveal variant="mask" as="span" underline>
                <span className="section-index" aria-hidden="true">04 — </span>
                <span className="section-title-word section-title-keyword">Contact</span>
              </Reveal>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <ContactInfoCard />
            <DeferredContactForm />
          </div>
        </section>
      </main>

      <FooterReveal>
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="grid grid-cols-2 items-center gap-x-3 gap-y-3 md:grid-cols-[1fr_auto_1fr] md:gap-0">
            <nav
              aria-label="Footer navigation"
              className="col-span-2 row-start-1 flex flex-nowrap justify-center gap-3 md:col-span-1 md:col-start-2 md:gap-6"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center px-1 text-[13px] font-normal text-[var(--text-muted)] underline decoration-transparent underline-offset-[6px] transition-[color,text-decoration-color] duration-200 hover:text-[var(--text)] hover:decoration-[var(--accent)] focus-visible:text-[var(--text)] focus-visible:decoration-[var(--accent)] md:px-0 md:text-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <p className="col-start-1 row-start-2 justify-self-end whitespace-nowrap font-mono text-[13px] text-[var(--text-muted)] md:col-start-1 md:row-start-1 md:justify-self-start">
              © 2026 Manav Shaji
            </p>
            <div className="col-start-2 row-start-2 flex items-center justify-self-start gap-3 md:col-start-3 md:row-start-1 md:justify-self-end md:gap-4">
              <div className="site-footer-social">
                <SocialLinks size="sm" />
              </div>
              <a
                href="#home"
                className="group hidden min-h-11 items-center gap-1 whitespace-nowrap font-mono text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)] md:inline-flex"
              >
                Back to top
                <span
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  ↑
                </span>
              </a>
            </div>
          </div>
        </div>
      </FooterReveal>
    </div>
  );
}
