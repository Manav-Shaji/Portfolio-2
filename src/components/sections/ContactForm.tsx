'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Reveal } from '@/components/effects/Reveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  message: z.string().min(10, 'Tell me a bit more about your project or role.'),
  website: z.string().optional(),
});

const contactResponseSchema = z.object({
  error: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', website: '' },
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
        {...form.register('website')}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      />
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
          {form.formState.isSubmitting ? 'Sending...' : 'Send message'}
          <Send className="h-4 w-4" />
        </button>
      </Reveal>
    </form>
  );
}
