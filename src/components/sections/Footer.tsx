import { Reveal } from '@/components/effects/Reveal';
import { navItems } from '@/data/navigation';
import { SocialLinks } from '@/components/ui/SocialLinks';

export function Footer() {
  return (
    <Reveal variant="fade" as="footer" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-7">
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0">
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:col-start-2 md:row-start-1 md:gap-x-6"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex min-h-11 items-center px-2 text-sm font-normal text-[var(--text-muted)] underline decoration-transparent underline-offset-[6px] transition-[color,text-decoration-color] duration-200 hover:text-[var(--text)] hover:decoration-[var(--accent)] focus-visible:text-[var(--text)] focus-visible:decoration-[var(--accent)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="text-center font-mono text-sm leading-6 text-[var(--text-muted)] md:col-start-1 md:row-start-1 md:text-left">
            © 2026 Manav Shaji
          </p>
          <div className="flex items-center justify-center gap-3 md:col-start-3 md:row-start-1 md:justify-self-end">
            <SocialLinks size="md" />
            <a
              href="#home"
              className="group hidden min-h-11 items-center gap-1 whitespace-nowrap font-mono text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)] focus-visible:text-[var(--text)] lg:translate-x-4 lg:inline-flex"
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
    </Reveal>
  );
}
