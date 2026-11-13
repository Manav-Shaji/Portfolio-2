export type SocialIcon = 'github' | 'linkedin' | 'mail';

const linkedin = 'https://www.linkedin.com/in/manavshaji/';

export const introStats = [
  ['MCA graduate', '2026'],
  ['Focus', 'Full-Stack & Frontend'],
  ['Based in', 'India'],
];

export const aboutStatement =
  'I enjoy turning product requirements into experiences that feel clear, polished, and reliable. My work sits at the intersection of design thinking, front-end craft, and practical engineering decisions that keep teams moving.';

export const projectCards = [
  {
    name: 'UrbanLedger',
    type: 'Finance dashboard',
    summary:
      'Built a responsive analytics platform for tracking budgets, subscriptions, and recurring expenses with role-based views and real-time summary insights.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
  },
  {
    name: 'SignalBoard',
    type: 'Internal operations tool',
    summary:
      'Designed a lean operations dashboard for team workflows, task monitoring, and status aggregation that reduced context switching across workflows.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
  },
  {
    name: 'Orbit Studio',
    type: 'Portfolio marketing site',
    summary:
      'Crafted a high-converting brand presence with editorial storytelling, clear conversion paths, and fast, content-driven pages tuned for SEO.',
    stack: ['Next.js', 'Content model', 'Motion', 'SEO'],
  },
];

export const skillGroups = [
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Motion', 'Accessibility'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'Supabase', 'Auth flows'],
  },
  {
    title: 'Product & Workflow',
    items: ['UI systems', 'Component architecture', 'Performance tuning', 'Agile delivery', 'Debugging', 'Testing'],
  },
];

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
