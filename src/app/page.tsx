"use client";

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Command } from 'cmdk';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { SocialLinks } from '../components/SocialLinks';
import { cn } from '../lib/utils';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const introStats = [
  ['MCA graduate', '2026'],
  ['Focus', 'Full-Stack & Frontend'],
  ['Based in', 'India'],
];

const projectCards = [
  {
    name: 'UrbanLedger',
    type: 'Finance dashboard',
    summary:
      'Built a responsive analytics platform for tracking budgets, subscriptions, and recurring expenses with role-based views and real-time summary insights.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
    accent: 'bg-[#20352e]',
  },
  {
    name: 'SignalBoard',
    type: 'Internal operations tool',
    summary:
      'Designed a lean operations dashboard for team workflows, task monitoring, and status aggregation that reduced context switching across workflows.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
    accent: 'bg-[#1d302d]',
  },
  {
    name: 'Orbit Studio',
    type: 'Portfolio marketing site',
    summary:
      'Crafted a high-converting brand presence with editorial storytelling, clear conversion paths, and fast, content-driven pages tuned for SEO.',
    stack: ['Next.js', 'Content model', 'Motion', 'SEO'],
    accent: 'bg-[#21302d]',
  },
];

const skillGroups = [
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

const quickActions = [
  { label: 'About me', target: 'about' },
  { label: 'Selected work', target: 'work' },
  { label: 'Skills', target: 'skills' },
  { label: 'Contact', target: 'contact' },
];

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  message: z.string().min(10, 'Tell me a bit more about your project or role.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('work');
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id).concat('home');
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.4, 0.7],
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }

      if (event.key === 'Escape') {
        setCommandOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useGSAP(
    () => {
      gsap.from('.hero-word', {
        y: 32,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
      gsap.from('.hero-meta, .hero-actions', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
      });
    },
    { scope: heroRef },
  );

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
    setCommandOpen(false);
  };

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast.success('Message sent — I will get back to you soon.');
    form.reset();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-40 mx-auto w-full max-w-6xl px-4 pb-2 pt-4 md:px-6">
        <div className="rounded-full border border-[var(--border)] bg-[rgba(5,5,5,0.78)] px-4 py-3 shadow-[0_12px_38px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <nav className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 text-left"
              aria-label="Go to the home section"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] font-mono text-[0.75rem] font-medium text-[var(--accent-hover)]">
                MS
              </span>
              <span className="text-sm font-medium tracking-[0.12em] text-[var(--text)] uppercase">Manav Shaji</span>
            </button>

            <div className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'relative text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text)]',
                    activeSection === item.id && 'text-[var(--text)]',
                  )}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-2 left-0 h-px w-full bg-[var(--accent)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                <span className="font-mono text-[0.75rem]">⌘K</span>
                Quick nav
              </button>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#050505] transition-colors hover:bg-[var(--accent-hover)]"
              >
                Resume
                <Download className="h-4 w-4" />
              </a>
            </div>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label="Toggle mobile navigation"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] p-2 text-[var(--text)] md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>

          {menuOpen && (
            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3 md:hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'rounded-full px-3 py-2 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-[rgba(255,255,255,0.02)] hover:text-[var(--text)]',
                    activeSection === item.id && 'bg-[rgba(126,240,192,0.08)] text-[var(--text)]',
                  )}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="#contact"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#050505]"
              >
                Resume
                <Download className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </header>

      <main id="home" className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <section ref={heroRef} className="relative py-[3.75rem] md:py-[5.25rem]">
          <div className="absolute inset-0 -z-10 opacity-90">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[rgba(126,240,192,0.1)] blur-3xl" />
            <div className="absolute right-10 top-16 h-64 w-64 rounded-full bg-[rgba(255,255,255,0.04)] blur-3xl" />
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <p className="hero-meta section-tag mb-6 flex items-center gap-3 text-[var(--accent-hover)]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                Available for frontend & full-stack roles
              </p>

              <h1 className="max-w-4xl text-[clamp(2.7rem,6vw,5rem)] font-semibold tracking-[-0.06em] text-[#ededed]">
                <span className="hero-word block">I build thoughtful</span>
                <span className="hero-word block">digital experiences</span>
                <span className="hero-word block">for people and products.</span>
                <span className="hero-word block text-[var(--accent)]">Reliable software.</span>
              </h1>

              <p className="hero-actions mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)] md:text-xl">
                I’m Manav Shaji, a 2026 MCA graduate focused on creating clean interfaces, scalable products, and reliable engineering systems.
              </p>

              <div className="hero-actions mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => scrollToSection('work')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[#050505] transition-colors hover:bg-[var(--accent-hover)]"
                >
                  View projects
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  Let’s talk
                  <Mail className="h-4 w-4" />
                </button>
              </div>

              <div className="hero-actions mt-8 flex flex-wrap items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Find me on
                </span>
                <SocialLinks size="md" />
              </div>
            </motion.div>

            <div
              aria-hidden="true"
              className="hero-terminal hidden min-h-[280px] w-full max-w-md justify-self-end rounded-3xl border border-[rgba(126,240,192,0.22)] bg-[#0b100e] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:block"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f7c66a]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                </div>
                <span className="font-mono text-xs text-[var(--text-muted)]">interface.tsx</span>
              </div>
              <div className="mt-6 space-y-3 font-mono text-[13px] leading-6">
                <p><span className="text-[#d29eff]">const</span> interface = {'{'}</p>
                <p className="pl-5"><span className="text-[#9bd9ff]">responsive</span>: <span className="text-[var(--accent)]">true</span>,</p>
                <p className="pl-5"><span className="text-[#9bd9ff]">accessible</span>: <span className="text-[var(--accent)]">true</span>,</p>
                <p className="pl-5"><span className="text-[#9bd9ff]">builtWithCare</span>: <span className="text-[var(--accent)]">true</span></p>
                <p>{'}'}</p>
                <p className="pt-2 text-[var(--text-muted)]">
                  <span className="text-[var(--accent)]">build</span>(interface);
                  <span className="terminal-cursor ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[var(--accent)]" />
                </p>
              </div>
            </div>
          </div>
        </section>

        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="py-[4.5rem] md:py-[5.25rem]"
        >
          <div className="mb-8 flex flex-col items-start gap-2">
            <span className="section-tag">01</span>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">About</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="max-w-xl text-lg leading-8 text-[var(--text-muted)]">
                I enjoy turning product requirements into experiences that feel clear, polished, and reliable. My work sits at the intersection of design thinking, front-end craft, and practical engineering decisions that keep teams moving.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Performance-first</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Accessible interfaces</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Pragmatic engineering</span>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(126,240,192,0.1)] text-[var(--accent-hover)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Current focus</p>
                  <p className="mt-1 text-lg font-medium text-[var(--text)]">Full-stack product work</p>
                </div>
              </div>
              <ul className="mt-6 space-y-4 text-sm text-[var(--text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  Building responsive interfaces with a strong eye for usability and detail.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  Connecting front-end design to backend data flows and production constraints.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  Improving workflow clarity through cleaner architecture and thoughtful iteration.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
            {introStats.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
                <p className="mt-2 text-lg font-medium text-[var(--text)]">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="work"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="py-[4.5rem] md:py-[5.25rem]"
        >
          <div className="mb-10 flex items-center justify-between gap-4">
            <span className="section-tag">02 — Work</span>
          </div>

          <div className="grid gap-5">
            {projectCards.map((project) => (
              <article
                key={project.name}
                className="group overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.01)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="grid gap-5 p-5 md:grid-cols-[0.7fr_1.3fr] md:p-7">
                  <div className={cn('rounded-[20px] border border-[rgba(126,240,192,0.2)] p-4 transition-[border-color,box-shadow] duration-200 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_26px_rgba(126,240,192,0.16)]', project.accent)}>
                    <div className="flex h-full min-h-[150px] flex-col justify-between">
                      <div className="flex items-center justify-between text-[var(--text-muted)]">
                        <Layers3 className="h-4 w-4" />
                        <span className="font-mono text-xs uppercase tracking-[0.14em]">{project.type}</span>
                      </div>
                      <div className="mt-6 flex items-center justify-between gap-2">
                        <span className="text-xl font-semibold text-[var(--text)]">{project.name}</span>
                        <ArrowUpRight className="h-4 w-4 text-[var(--accent-hover)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">Case study</p>
                      <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{project.summary}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span key={item} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="py-[4.5rem] md:py-[5.25rem]"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="section-tag">03 — Skills</span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.title} className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] text-[var(--accent-hover)]">
                    {group.title === 'Frontend' ? (
                      <Code2 className="h-4 w-4" />
                    ) : group.title === 'Backend' ? (
                      <BriefcaseBusiness className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text)]">{group.title}</h3>
                </div>
                <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)] pb-2 last:border-b-0 last:pb-0">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="py-[4.5rem] md:py-[5.25rem]"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="section-tag">04 — Contact</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="text-2xl font-semibold text-[var(--text)]">Let’s build something thoughtful.</p>
              <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
                I’m currently open to entry-level full-stack and front-end opportunities where strong product thinking, UX clarity, and clean engineering matter.
              </p>

              <div className="mt-6">
                <SocialLinks size="md" />
              </div>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-[var(--text-muted)]">
                    Name
                  </label>
                  <input
                    id="name"
                    {...form.register('name')}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                    placeholder="Your name"
                  />
                  {form.formState.errors.name && (
                    <p className="mt-2 text-sm text-red-300">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-[var(--text-muted)]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                    placeholder="your@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="mt-2 text-sm text-red-300">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-sm text-[var(--text-muted)]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...form.register('message')}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                  placeholder="Tell me about the role, product, or problem you’re solving."
                />
                {form.formState.errors.message && (
                  <p className="mt-2 text-sm text-red-300">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[#050505] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {form.formState.isSubmitting ? 'Sending...' : 'Send inquiry'}
                <ExternalLink className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.section>
      </main>

      <footer className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-[var(--border)] px-4 py-8 md:px-6">
        <p className="font-mono text-xs text-[var(--text-muted)]">Manav Shaji</p>
        <SocialLinks size="sm" />
      </footer>

      <Command.Dialog open={commandOpen} onOpenChange={setCommandOpen} label="Portfolio quick navigation">
        <div className="fixed inset-0 z-50 bg-[rgba(5,7,12,0.7)] backdrop-blur-sm" />
        <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-[26px] border border-[var(--border)] bg-[#111412] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <Command value="" onValueChange={(value) => { const match = quickActions.find((item) => item.label === value); if (match) scrollToSection(match.target); }} className="w-full">
            <Command.Input
              placeholder="Search sections..."
              className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
            />
            <Command.List className="mt-3 max-h-64 overflow-y-auto">
              {quickActions.map((action) => (
                <Command.Item
                  key={action.label}
                  value={action.label}
                  onSelect={() => scrollToSection(action.target)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text)]"
                >
                  <span>{action.label}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </div>
      </Command.Dialog>
    </div>
  );
}
