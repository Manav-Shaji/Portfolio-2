import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/effects/Reveal';
import { projects } from '@/data/projects';

export function Work() {
  return (
    <section id="work" className="py-[4.5rem] md:py-[5.25rem]">
      <div className="mb-10 flex items-center justify-between gap-4">
        <h2
          aria-label="Work"
          className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
        >
          <Reveal variant="mask" as="span" underline>
            <span className="section-index" aria-hidden="true">
              02 —{' '}
            </span>
            <span className="section-title-word section-title-keyword">Work</span>
          </Reveal>
        </h2>
      </div>

      <Reveal variant="stagger" className="grid gap-5 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.name}
            data-project-card
            data-has-link={project.href ? 'true' : 'false'}
            className={`premium-border premium-card project-card overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.01)] ${
              project.href ? 'group transition-transform duration-200 hover:-translate-y-1' : ''
            }`}
          >
            <div className="grid gap-5 p-5 md:grid-cols-[0.7fr_1.3fr] md:p-7 lg:grid-cols-1">
              <div className="project-visual">
                <Reveal
                  variant="clip"
                  className="block w-full"
                  parallax
                  aria-hidden={true}
                >
                  <div className="project-preview" aria-hidden="true">
                    <div className="preview-window">
                      <div className="preview-toolbar">
                        <span className="preview-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className="preview-toolbar-mark" />
                      </div>
                      <div className="preview-dashboard">
                        <div className="preview-sidebar">
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="preview-content">
                          <span className="preview-skeleton preview-skeleton-title" />
                          <div className="preview-metrics">
                            <i />
                            <i />
                            <i />
                          </div>
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
                  {project.href ? (
                    <a
                      href={project.href}
                      className="text-xl font-semibold text-[var(--text)]"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <span className="text-xl font-semibold text-[var(--text)]">
                      {project.name}
                    </span>
                  )}
                  {project.href && (
                    <ArrowUpRight className="h-4 w-4 text-[var(--accent-hover)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {project.type}
                </p>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  {project.href && (
                    <p className="text-sm font-medium text-[var(--text)]">Case study</p>
                  )}
                  <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
                    {project.summary}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)]"
                    >
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
  );
}
