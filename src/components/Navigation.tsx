'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { navItems } from '../data/navigation';

const CommandPalette = dynamic(
  () => import('./CommandPalette').then((module) => module.CommandPalette),
  { ssr: false },
);

function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;

  const reducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  section.scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState('work');
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const sectionIds: string[] = [...navItems.map((item) => item.id), 'home'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) setActiveSection(visibleEntry.target.id);
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.4, 0.7],
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }

      if (event.key === 'Escape') {
        setCommandOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navigateTo = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
    setCommandOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 mx-auto w-full max-w-6xl px-4 pb-2 pt-4 md:px-6">
        <div
          data-site-nav
          className="premium-border premium-navbar rounded-full border border-[var(--border)] bg-[rgba(5,5,5,0.78)] px-4 py-3 shadow-[0_12px_38px_rgba(0,0,0,0.28)] backdrop-blur-xl"
        >
          <nav className="flex items-center justify-between gap-3">
            <a
              href="#home"
              className="flex items-center gap-2 text-left"
              aria-label="Go to the home section"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] font-mono text-[0.75rem] font-medium text-[var(--accent-hover)]">
                MS
              </span>
              <span className="text-sm font-medium tracking-[0.12em] text-[var(--text)] uppercase">
                Manav Shaji
              </span>
            </a>

            <div className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  className={`relative text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text)] ${
                    activeSection === item.id ? 'text-[var(--text)]' : ''
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-2 left-0 h-px w-full bg-[var(--accent)]" />
                  )}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="premium-border inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                <span className="font-mono text-[0.75rem]">⌘K</span>
                Quick nav
              </button>
              <a
                href="#contact"
                className="mint-cta premium-border inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-[#050505] transition-colors hover:bg-[var(--accent-hover)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)]"
              >
                Resume
                <Download className="h-4 w-4" />
              </a>
            </div>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label="Toggle mobile navigation"
              onClick={() => setMenuOpen((current) => !current)}
              className="premium-border inline-flex items-center justify-center rounded-full border border-[var(--border)] p-2 text-[var(--text)] md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>

          {menuOpen && (
            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3 md:hidden">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-full px-3 py-2 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-[rgba(255,255,255,0.02)] hover:text-[var(--text)] ${
                    activeSection === item.id
                      ? 'bg-[rgba(126,240,192,0.08)] text-[var(--text)]'
                      : ''
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mint-cta premium-border mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-[#050505] transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)]"
              >
                Resume
                <Download className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </header>
      {commandOpen && (
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          onNavigate={navigateTo}
        />
      )}
    </>
  );
}
