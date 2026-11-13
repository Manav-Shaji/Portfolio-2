export type SkillGroup = Readonly<{
  title: string;
  icon: 'code' | 'backend' | 'product';
  items: readonly string[];
}>;

export const skillGroups = [
  {
    title: 'Frontend',
    icon: 'code',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Motion', 'Accessibility'],
  },
  {
    title: 'Backend',
    icon: 'backend',
    items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'Supabase', 'Auth flows'],
  },
  {
    title: 'Product & Workflow',
    icon: 'product',
    items: ['UI systems', 'Component architecture', 'Performance tuning', 'Agile delivery', 'Debugging', 'Testing'],
  },
] satisfies readonly SkillGroup[];
