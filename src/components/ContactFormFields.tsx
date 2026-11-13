import type { UseFormRegisterReturn } from 'react-hook-form';
import { Send } from 'lucide-react';

type Props = {
  nameRegistration?: UseFormRegisterReturn;
  emailRegistration?: UseFormRegisterReturn;
  messageRegistration?: UseFormRegisterReturn;
  errors?: {
    name?: string;
    email?: string;
    message?: string;
  };
  isSubmitting?: boolean;
};

export function ContactFormFields({
  nameRegistration,
  emailRegistration,
  messageRegistration,
  errors,
  isSubmitting = false,
}: Props) {
  return (
    <>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-[var(--text-muted)]">
          Name
        </label>
        <input
          id="name"
          {...nameRegistration}
          className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
          placeholder="Your name"
        />
        {errors?.name && (
          <p className="mt-2 text-sm text-red-300">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-[var(--text-muted)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...emailRegistration}
          className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
          placeholder="your@email.com"
        />
        {errors?.email && (
          <p className="mt-2 text-sm text-red-300">{errors.email}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="message" className="mb-2 block text-sm text-[var(--text-muted)]">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...messageRegistration}
          className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(5,5,5,0.72)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
          placeholder="Tell me about the role, product, or problem you’re solving."
        />
        {errors?.message && (
          <p className="mt-2 text-sm text-red-300">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mint-cta premium-border mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm text-[#050505] transition-colors hover:bg-[var(--accent-hover)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(126,240,192,0.2)] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2 md:justify-self-start"
      >
        {isSubmitting ? 'Sending...' : 'Send message'}
        <Send className="h-4 w-4" />
      </button>
    </>
  );
}
