"use client";

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Command } from 'cmdk';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { BackgroundFX } from '../components/BackgroundFX';
import { Marquee } from '../components/Marquee';
import { PortfolioEffects } from '../components/PortfolioEffects';
import { Reveal } from '../components/Reveal';
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

const aboutStatement =
  'I enjoy turning product requirements into experiences that feel clear, polished, and reliable. My work sits at the intersection of design thinking, front-end craft, and practical engineering decisions that keep teams moving.';

const projectCards = [
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
  const shouldReduceMotion = useReducedMotion();
  const mainRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

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
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false) {
        return;
      }

      const revealPage = () => {
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
      };

      if (
        typeof window.matchMedia !== 'function' ||
        window.sessionStorage.getItem('portfolio-intro-seen')
      ) {
        revealPage();
        return;
      }

      window.sessionStorage.setItem('portfolio-intro-seen', 'true');
      if (introRef.current) {
        introRef.current.dataset.active = 'true';
      }
      gsap.delayedCall(1.2, () => {
        if (introRef.current) {
          introRef.current.dataset.active = 'false';
        }
        revealPage();
      });
    },
    {
      scope: mainRef,
    },
  );

  useGSAP(
    () => {
      if (
        typeof window.matchMedia !== 'function' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      const paragraph = mainRef.current?.querySelector<HTMLElement>(
        '.about-scroll-paragraph',
      );
      const words = paragraph?.querySelectorAll<HTMLElement>('.about-scroll-word');
      if (!paragraph || !words?.length) {
        return;
      }

      gsap.fromTo(
        words,
        { opacity: 0.25 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.01,
          scrollTrigger: {
            trigger: paragraph,
            start: 'top 85%',
            end: 'bottom 20%',
            scrub: true,
          },
        },
      );
    },
    { scope: mainRef },
  );

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior:
          (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
            ? 'auto'
            : 'smooth',
        block: 'start',
      });
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
    <div className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-[var(--text)]">
      <BackgroundFX />
      <PortfolioEffects />
      <div ref={introRef} className="intro-screen" aria-hidden="true" data-active="false">
        <span>initializing portfolio...</span>
      </div>

      <header className="sticky top-0 z-40 mx-auto w-full max-w-6xl px-4 pb-2 pt-4 md:px-6">
        <div
          data-site-nav
          className="premium-border premium-navbar rounded-full border border-[var(--border)] bg-[rgba(5,5,5,0.78)] px-4 py-3 shadow-[0_12px_38px_rgba(0,0,0,0.28)] backdrop-blur-xl"
        >
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
                className="premium-border inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                <span className="font-mono text-[0.75rem]">⌘K</span>
                Quick nav
              </button>
              <a
                href="#contact"
                className="mint-cta premium-border inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-[#050505] transition-colors hover:bg-[var(--accent-hover)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)]"
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
              className="premium-border inline-flex items-center justify-center rounded-full border border-[var(--border)] p-2 text-[var(--text)] md:hidden"
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
                className="mint-cta premium-border mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-[#050505] transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)]"
              >
                Resume
                <Download className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </header>

      <main ref={mainRef} id="home" className="mx-auto max-w-6xl px-4 pb-0 md:px-6">
        <section className="relative py-[3.75rem] md:py-[5.25rem]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-2"
            >
              <p className="hero-meta section-tag mb-6 flex items-center gap-3 text-[var(--accent-hover)]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                Available for frontend & full-stack roles
              </p>

              <h1 className="hero-heading font-semibold text-[#ededed]">
                <span className="hero-word block">
                  I build thoughtful digital experiences for people and products.
                </span>
                <span className="hero-word hero-accent block">Reliable software.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="max-w-4xl"
            >
              <p className="hero-actions mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)] md:text-xl">
                I’m Manav Shaji, a 2026 MCA graduate focused on creating clean interfaces, scalable products, and reliable engineering systems.
              </p>

              <div className="hero-actions mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => scrollToSection('work')}
                  className="mint-cta premium-border inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm text-[#050505] transition-colors hover:bg-[var(--accent-hover)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)]"
                >
                  View projects
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="premium-border inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
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
              className="hero-terminal premium-border hidden min-h-[280px] w-full max-w-md justify-self-end rounded-3xl border border-[rgba(126,240,192,0.22)] bg-[#0b100e] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:block"
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

        <Marquee />

        <section id="about" className="py-[4.5rem] md:py-[5.25rem]">
          <div className="mb-8 flex flex-col items-start gap-2">
            <span className="section-tag">01</span>
            <h2 className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">
              <Reveal variant="mask" as="span" underline>
                <span className="section-title-word section-title-keyword">About</span>
              </Reveal>
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="about-scroll-paragraph max-w-xl text-lg leading-8 text-[var(--text-muted)]">
                {aboutStatement.split(' ').map((word, index, words) => (
                  <span className="about-scroll-word" key={`${word}-${index}`}>
                    {word}{index < words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Performance-first</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Accessible interfaces</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1.5">Pragmatic engineering</span>
              </div>
            </div>

            <div className="premium-border premium-card rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
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

          <Reveal
            variant="stagger"
            className="gradient-divider mt-8 grid gap-4 pt-6 sm:grid-cols-3"
          >
            {introStats.map(([label, value]) => (
              <div key={label} className="premium-border premium-card rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
                <p className="mt-2 text-lg font-medium text-[var(--text)]">{value}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="work" className="py-[4.5rem] md:py-[5.25rem]">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2
              aria-label="Work"
              className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
            >
              <span className="sr-only" aria-hidden="true">02 — Work</span>
              <Reveal variant="mask" as="span" underline>
                <span className="section-index" aria-hidden="true">02 — </span>
                <span className="section-title-word section-title-keyword">Work</span>
              </Reveal>
            </h2>
          </div>

          <Reveal variant="stagger" className="grid gap-5 lg:grid-cols-3">
            {projectCards.map((project) => (
              <article
                key={project.name}
                data-project-card
                className="premium-border premium-card project-card group overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.01)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="grid gap-5 p-5 md:grid-cols-[0.7fr_1.3fr] md:p-7 lg:grid-cols-1">
                  <div className="project-visual">
                    <Reveal
                      variant="clip"
                      className="project-preview-clip"
                      parallax
                      aria-hidden={true}
                    >
                      <div className="project-preview" aria-hidden="true">
                        <div className="preview-window">
                          <div className="preview-toolbar">
                            <span className="preview-dots"><i /><i /><i /></span>
                            <span className="preview-toolbar-mark" />
                          </div>
                          <div className="preview-dashboard">
                            <div className="preview-sidebar">
                              <i /><i /><i /><i />
                            </div>
                            <div className="preview-content">
                              <span className="preview-skeleton preview-skeleton-title" />
                              <div className="preview-metrics"><i /><i /><i /></div>
                              <div className="preview-chart">
                                <svg viewBox="0 0 240 64" preserveAspectRatio="none">
                                  <path d="M2 54 C28 47 36 52 58 38 S91 41 112 27 143 37 164 21 196 26 238 7" />
                                </svg>
                              </div>
                              <span className="preview-skeleton preview-skeleton-row" />
                              <span className="preview-skeleton preview-skeleton-row preview-skeleton-short" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="text-xl font-semibold text-[var(--text)]">{project.name}</span>
                      <ArrowUpRight className="h-4 w-4 text-[var(--accent-hover)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{project.type}</p>
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
          </Reveal>
        </section>

        <section id="skills" className="py-[4.5rem] md:py-[5.25rem]">
          <div className="mb-8 flex items-center gap-3">
            <h2
              aria-label="Skills"
              className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
            >
              <Reveal variant="mask" as="span" underline>
                <span className="section-index" aria-hidden="true">03 — </span>
                <span className="section-title-word section-title-keyword">Skills</span>
              </Reveal>
            </h2>
          </div>

          <Reveal variant="stagger" className="grid gap-5 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.title} className="premium-border premium-card rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
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
                <Reveal
                  as="ul"
                  variant="stagger"
                  className="space-y-3 text-sm text-[var(--text-muted)]"
                  staggerDelay={0.04}
                >
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)] pb-2 last:border-b-0 last:pb-0">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </Reveal>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="contact" className="py-[4.5rem] md:py-[5.25rem]">
          <div className="mb-8 flex items-center gap-3">
            <h2
              aria-label="Contact"
              className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
            >
              <Reveal variant="mask" as="span" underline>
                <span className="section-index" aria-hidden="true">04 — </span>
                <span className="section-title-word section-title-keyword">Contact</span>
              </Reveal>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="premium-border premium-card rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="text-2xl font-semibold text-[var(--text)]">Let’s build something thoughtful.</p>
              <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
                I’m currently open to entry-level full-stack and front-end opportunities where strong product thinking, UX clarity, and clean engineering matter.
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="premium-border premium-card rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6"
            >
              <Reveal
                variant="stagger"
                className="contact-form-fields grid gap-5 md:grid-cols-2"
              >
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

                <div className="md:col-span-2">
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
                  className="mint-cta premium-border mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm text-[#050505] transition-colors hover:bg-[var(--accent-hover)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2 md:justify-self-start"
                >
                  {form.formState.isSubmitting ? 'Sending...' : 'Send inquiry'}
                  <ExternalLink className="h-4 w-4" />
                </button>
              </Reveal>
            </form>
          </div>
        </section>
      </main>

      <motion.footer
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="gradient-divider w-full"
      >
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="grid grid-cols-2 items-center gap-x-3 gap-y-3 md:grid-cols-[1fr_auto_1fr] md:gap-0">
            <nav
              aria-label="Footer navigation"
              className="col-span-2 row-start-1 flex flex-nowrap justify-center gap-3 md:col-span-1 md:col-start-2 md:gap-6"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className="inline-flex min-h-11 items-center px-1 text-[13px] font-normal text-[var(--text-muted)] underline decoration-transparent underline-offset-[6px] transition-[color,text-decoration-color] duration-200 hover:text-[var(--text)] hover:decoration-[var(--accent)] focus-visible:text-[var(--text)] focus-visible:decoration-[var(--accent)] md:px-0 md:text-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <p className="col-start-1 row-start-2 justify-self-end whitespace-nowrap font-mono text-[13px] text-[var(--text-muted)] md:col-start-1 md:row-start-1 md:justify-self-start">
              © 2026 Manav Shaji
            </p>
            <div className="col-start-2 row-start-2 flex items-center justify-self-start gap-3 md:col-start-3 md:row-start-1 md:justify-self-end md:gap-4">
              <div className="site-footer-social">
                <SocialLinks size="sm" />
              </div>
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('home');
                }}
                className="group hidden min-h-11 items-center gap-1 whitespace-nowrap font-mono text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)] md:inline-flex"
              >
                Back to top
                <span
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  ↑
                </span>
              </a>
            </div>
          </div>
        </div>
      </motion.footer>

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
