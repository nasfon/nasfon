import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters long.'),
  _gotcha: z.string().optional(), // Honeypot
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  clientName: z.string().trim().min(2, 'Your name must be at least 2 characters.'),
  companyName: z.string().trim().optional(),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().optional(),
  serviceType: z.enum([
    'web-development',
    'mobile-development',
    'saas-development',
    'api-development',
    'cloud-devops',
    'mvp-development',
    'other',
  ], {
    message: 'Please select a valid service type.',
  }),
  budgetRange: z.string().trim().optional(),
  timeline: z.string().trim().optional(),
  description: z.string().trim().min(15, 'Please provide at least a brief description of your project (min 15 characters).'),
  _gotcha: z.string().optional(), // Honeypot
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
