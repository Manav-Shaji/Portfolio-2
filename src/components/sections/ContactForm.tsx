'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { CONTACT_LIMITS, contactSchema } from '@/lib/contact';
import type { ContactFormValues } from '@/lib/contact';

const contactResponseSchema = z.object({
  error: z.string().optional(),
});

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', company_url: '' },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const result: unknown = await response.json();
        const parsed = contactResponseSchema.safeParse(result);
        toast.error(
          parsed.success && parsed.data.error
            ? parsed.data.error
            : 'Could not send your message. Please try again.',
        );
        return;
      }

      toast.success('Message sent — I will get back to you soon.');
      form.reset();
    } catch (error) {
      console.error('Contact message submission failed.', error);
      toast.error('Could not send your message. Please try again.');
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="premium-border premium-card relative rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6"
    >
      <input
        {...form.register('company_url')}
        name="company_url"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      />
      <div className="flow-root">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-[var(--text-muted)]">
            Name
          </label>
          <input
            id="name"
            {...form.register('name')}
            maxLength={CONTACT_LIMITS.name.max}
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(form.formState.errors.name)}
            aria-describedby={form.formState.errors.name ? 'name-error' : undefined}
            className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
            placeholder="Your name"
          />
          {form.formState.errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-300">
              {form.formState.errors.name.message}
            </p>
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
            maxLength={CONTACT_LIMITS.email.max}
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
            className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
            placeholder="your@email.com"
          />
          {form.formState.errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-300">
              {form.formState.errors.email.message}
            </p>
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
            maxLength={CONTACT_LIMITS.message.max}
            aria-required="true"
            aria-invalid={Boolean(form.formState.errors.message)}
            aria-describedby={form.formState.errors.message ? 'message-error' : undefined}
            className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
            placeholder="Tell me about the role, product, or problem you’re solving."
          />
          {form.formState.errors.message && (
            <p id="message-error" className="mt-2 text-sm text-red-300">
              {form.formState.errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mint-cta premium-border mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm text-[#050505] transition-colors hover:bg-[var(--accent-hover)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2 md:justify-self-start"
        >
          {form.formState.isSubmitting ? 'Sending...' : 'Send message'}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
