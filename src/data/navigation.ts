export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

export const quickActions = [
  { label: 'About me', target: 'about' },
  { label: 'Selected work', target: 'work' },
  { label: 'Skills', target: 'skills' },
  { label: 'Contact', target: 'contact' },
] as const;
