import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * General inquiries from the contact page form.
 */
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // 'new' | 'reviewed' | 'contacted' | 'archived'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Detailed project intake / client application form submissions.
 */
export const projectApplications = sqliteTable('project_applications', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  companyName: text('company_name'),
  email: text('email').notNull(),
  phone: text('phone'),
  serviceType: text('service_type').notNull(), // 'web-development' | 'mobile-development' | 'saas-development' | 'api-development' | 'cloud-devops' | 'mvp-development' | 'other'
  budgetRange: text('budget_range'),
  timeline: text('timeline'),
  description: text('description').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'in_review' | 'accepted' | 'declined'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type ProjectApplication = typeof projectApplications.$inferSelect;
export type NewProjectApplication = typeof projectApplications.$inferInsert;
