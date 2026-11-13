'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Reveal } from './Reveal';
import { ContactFormFields } from './ContactFormFields';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  message: z.string().min(10, 'Tell me a bit more about your project or role.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast.success('Message sent — I will get back to you soon.');
    form.reset();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="premium-border premium-card rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6"
    >
      <Reveal
        variant="stagger"
        className="contact-form-fields grid gap-5 md:grid-cols-2"
      >
        <ContactFormFields
          nameRegistration={form.register('name')}
          emailRegistration={form.register('email')}
          messageRegistration={form.register('message')}
          errors={{
            name: form.formState.errors.name?.message,
            email: form.formState.errors.email?.message,
            message: form.formState.errors.message?.message,
          }}
          isSubmitting={form.formState.isSubmitting}
        />
      </Reveal>
    </form>
  );
}
