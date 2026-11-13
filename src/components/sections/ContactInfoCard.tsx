'use client';

import { useEffect, useState } from 'react';
import { ArrowDownToLine, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Reveal } from '@/components/effects/Reveal';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { site } from '@/data/site';

const contactEmail = 'manav.shaji.m@gmail.com';
const services = [
  'Frontend development',
  'Full-stack apps',
  'UI implementation',
  'Performance tuning',
];

function copyWithFallback(value: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.setAttribute('aria-hidden', 'true');
  textArea.tabIndex = -1;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.append(textArea);
  textArea.select();

  try {
    return document.execCommand('copy');
  } finally {
    textArea.remove();
  }
}

function getKolkataTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date());
}

export function ContactInfoCard() {
  const [localTime, setLocalTime] = useState('--:--');

  useEffect(() => {
    const updateTime = () => setLocalTime(getKolkataTime());
    updateTime();
    const timer = window.setInterval(updateTime, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const handleCopyEmail = async () => {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(contactEmail);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        copied = copyWithFallback(contactEmail);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      toast.success('Email copied');
      return;
    }

    toast.error('Could not copy email. Please copy the address manually.');
  };

  return (
    <article
      aria-label="Contact details"
      className="premium-border premium-card relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5 md:p-6"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 z-[1] h-64 w-64 rounded-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(126,240,192,0.07),transparent_68%)]"
      />

      <Reveal
        variant="stagger"
        staggerDelay={0.04}
        className="relative z-10 flex flex-1 flex-col"
      >
        <div>
          <h3 className="text-xl font-semibold leading-7 text-[var(--text)]">
            Let’s build something thoughtful.
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            I’m currently open to entry-level full-stack and front-end opportunities where strong
            product thinking, UX clarity, and clean engineering matter.
          </p>
        </div>

        <p className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[12px] text-[var(--text-muted)] sm:text-[13px]">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] motion-safe:animate-pulse"
          />
          Open to full-time roles · 2026
        </p>

        <dl className="mt-2 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          <div className="flex items-center justify-between gap-3 py-1">
            <dt className="shrink-0 font-mono text-[12px] text-[var(--text-muted)]">Email</dt>
            <dd className="flex min-w-0 items-center gap-2">
              <a
                href={`mailto:${contactEmail}`}
                className="whitespace-nowrap text-right text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--accent)]"
              >
                {contactEmail}
              </a>
              <button
                type="button"
                aria-label="Copy email address"
                onClick={handleCopyEmail}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Copy aria-hidden="true" size={15} />
              </button>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-3 py-1">
            <dt className="shrink-0 font-mono text-[12px] text-[var(--text-muted)]">Location</dt>
            <dd className="flex min-w-0 flex-wrap justify-end gap-x-1 text-right text-sm text-[var(--text)]">
              <span>Kerala, India ·</span>
              <time
                role="timer"
                aria-label="Local time in Kerala"
                aria-live="off"
                className="font-mono tabular-nums"
              >
                {localTime} IST
              </time>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-3 py-1">
            <dt className="shrink-0 font-mono text-[12px] text-[var(--text-muted)]">
              Response time
            </dt>
            {/* TODO: Confirm the response-time estimate before publishing. */}
            <dd className="text-right text-sm text-[var(--text)]">Usually within 24 hours</dd>
          </div>
        </dl>

        <div className="mt-2">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            How I can help
          </p>
          <ul className="flex flex-wrap gap-1.5" aria-label="How I can help">
            {services.map((service) => (
              <li
                key={service}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[12px] leading-4 text-[var(--text-muted)]"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <SocialLinks size="md" />
          <a
            href={site.resumeUrl}
            download
            className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--accent)]"
          >
            Download resume
            <ArrowDownToLine aria-hidden="true" size={16} />
          </a>
        </div>
      </Reveal>
    </article>
  );
}
