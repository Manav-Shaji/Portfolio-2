export type Project = Readonly<{
  name: string;
  type: string;
  summary: string;
  stack: readonly string[];
}>;

export const projects = [
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
] satisfies readonly Project[];
