import { ContactFormFields } from './ContactFormFields';

export function ContactFormFallback() {
  return (
    <form className="premium-border premium-card rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6">
      <div
        className="contact-form-fields grid gap-5 md:grid-cols-2"
        data-reveal="stagger"
      >
        <ContactFormFields />
      </div>
    </form>
  );
}
