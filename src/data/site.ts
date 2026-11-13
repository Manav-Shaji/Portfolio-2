export type SocialIcon = 'github' | 'linkedin' | 'mail';

const linkedin = 'https://www.linkedin.com/in/manavshaji/';

export const site = {
  linkedin,
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/Manav-Shaji',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      href: linkedin,
      icon: 'linkedin',
    },
    {
      label: 'Email',
      href: 'mailto:manavshaji.dev@gmail.com',
      icon: 'mail',
    },
  ] satisfies ReadonlyArray<{
    label: string;
    href: string;
    icon: SocialIcon;
  }>,
} as const;
