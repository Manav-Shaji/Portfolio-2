export type SkillGroup = Readonly<{
  title: string;
  items: readonly string[];
}>;

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
] satisfies readonly SkillGroup[];
