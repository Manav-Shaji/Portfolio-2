import { Mail } from 'lucide-react';
import { site } from '../data/site';
import type { SocialIcon } from '../data/site';

type Props = {
  size: 'md' | 'sm';
};

function SocialIconGraphic({ icon, className }: { icon: SocialIcon; className: string }) {
  if (icon === 'mail') {
    return <Mail aria-hidden="true" className={className} />;
  }

  if (icon === 'github') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.02-.7.08-.69.08-.69 1.12.08 1.72 1.15 1.72 1.15 1 .1.75 1.5 2.71 1.5.77 0 1.33-.23 1.68-.6.08-.72.31-1.21.57-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.16-2.99-.12-.28-.5-1.42.11-2.95 0 0 .95-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.13-1.44 3.08-1.14 3.08-1.14.61 1.53.23 2.67.11 2.95.72.78 1.16 1.77 1.16 2.99 0 4.29-2.62 5.23-5.11 5.51.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.67V9.4h2.67V18ZM7 8.22a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1ZM18.34 18h-2.67v-4.18c0-1-.02-2.29-1.4-2.29-1.4 0-1.61 1.1-1.61 2.22V18H10V9.4h2.56v1.17h.04a2.8 2.8 0 0 1 2.52-1.39c2.7 0 3.21 1.78 3.21 4.1V18Z" />
    </svg>
  );
}

export function SocialLinks({ size }: Props) {
  const iconClassName = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div role="group" aria-label="Social links" className="flex items-center gap-2">
      {site.socials.map(({ label, href, icon }) => {
        const isEmail = icon === 'mail';

        return (
          <a
            key={label}
            aria-label={label}
            className="social-link"
            href={href}
            rel={isEmail ? undefined : 'noreferrer'}
            target={isEmail ? undefined : '_blank'}
          >
            <SocialIconGraphic className={iconClassName} icon={icon} />
          </a>
        );
      })}
    </div>
  );
}
