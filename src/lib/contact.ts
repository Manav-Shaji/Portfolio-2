import { z } from 'zod';

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .refine((value) => !/[\r\n]/.test(value), 'Please enter your name.')
    .pipe(
      z
        .string()
        .trim()
        .min(CONTACT_LIMITS.name.min, 'Please enter your name.')
        .max(CONTACT_LIMITS.name.max, 'Please enter your name.'),
    ),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email.')
    .max(CONTACT_LIMITS.email.max, 'Please enter a valid email.'),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.message.min,
      'Tell me a bit more about your project or role.',
    )
    .max(
      CONTACT_LIMITS.message.max,
      'Tell me a bit more about your project or role.',
    ),
  company_url: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
