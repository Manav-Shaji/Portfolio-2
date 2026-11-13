import dynamic from 'next/dynamic';
import { Reveal } from '@/components/effects/Reveal';
import { ContactInfoCard } from './ContactInfoCard';

const ContactForm = dynamic(
  () => import('./ContactForm').then((module) => module.ContactForm),
);

export function Contact() {
  return (
    <section id="contact" className="py-[4.5rem] md:py-[5.25rem]">
      <div className="mb-8 flex items-center gap-3">
        <h2
          aria-label="Contact"
          className="section-title text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]"
        >
          <Reveal variant="mask" as="span" underline>
            <span className="section-index" aria-hidden="true">
              04 —{' '}
            </span>
            <span className="section-title-word section-title-keyword">Contact</span>
          </Reveal>
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <ContactInfoCard />
        <ContactForm />
      </div>
    </section>
  );
}
