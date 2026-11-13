export type SocialIcon = 'github' | 'linkedin' | 'mail';

const linkedin = 'https://www.linkedin.com/in/manavshaji/';

export const introStats = [
  ['MCA graduate', '2026'],
  ['Focus', 'Full-Stack & Frontend'],
  ['Based in', 'India'],
];

export const aboutStatement =
  'I enjoy turning product requirements into experiences that feel clear, polished, and reliable. My work sits at the intersection of design thinking, front-end craft, and practical engineering decisions that keep teams moving.';

export const site = {
  linkedin,
  marquee: [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'GSAP',
    'Motion',
    'Node.js',
    'Python',
    'PostgreSQL',
  ],
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
