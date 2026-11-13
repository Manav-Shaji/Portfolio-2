import { BriefcaseBusiness, Code2, MapPin } from 'lucide-react';
import { Reveal } from '@/components/effects/Reveal';
import { skillGroups } from '@/data/skills';

function getGroupIcon(icon: (typeof skillGroups)[number]['icon']) {
  switch (icon) {
    case 'code':
      return <Code2 className="h-4 w-4" />;
    case 'backend':
      return <BriefcaseBusiness className="h-4 w-4" />;
    case 'product':
      return <MapPin className="h-4 w-4" />;
    default:
      return null;
  }
}

export function Skills() {
  return (
    <section id="skills" className="py-[4.5rem] md:py-[5.25rem]">
      <div className="mb-8 flex items-center gap-3">
        <h2
          aria-label="Skills"
          className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
        >
          <Reveal variant="mask" as="span" underline>
            <span className="section-index" aria-hidden="true">
              03 —{' '}
            </span>
            <span className="section-title-word section-title-keyword">Skills</span>
          </Reveal>
        </h2>
      </div>

      <Reveal variant="stagger" className="grid gap-5 md:grid-cols-3">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="premium-border premium-card rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] text-[var(--accent-hover)]">
                {getGroupIcon(group.icon)}
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
                <li
                  key={item}
                  className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)] pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </Reveal>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
