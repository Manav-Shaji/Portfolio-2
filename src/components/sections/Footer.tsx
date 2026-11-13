import { Reveal } from '@/components/effects/Reveal';
import { navItems } from '@/data/navigation';
import { SocialLinks } from '@/components/ui/SocialLinks';

export function Footer() {
  return (
    <Reveal variant="fade" as="footer" className="gradient-divider">
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
            <SocialLinks size="sm" />
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
    </Reveal>
  );
}
