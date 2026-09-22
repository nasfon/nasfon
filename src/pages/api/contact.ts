import type { APIRoute } from 'astro';
import { db, ensureTablesCreated } from '../../db';
import { contactSubmissions } from '../../db/schema';
import { contactSchema } from '../../lib/validation';
import { isSpamSubmission } from '../../lib/spam';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let rawData: Record<string, any> = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        rawData = await request.json();
      } catch {
        rawData = {};
      }
    } else {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        rawData[key] = value.toString();
      });
    }

    // 1. Bot check (Honeypot)
    if (isSpamSubmission(rawData._gotcha)) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Thank you for your message! We will get back to you shortly.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate input with Zod
    const validationResult = contactSchema.safeParse(rawData);
    if (!validationResult.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join('.') || 'general';
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please review your input.',
          errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validData = validationResult.data;

    // 3. Ensure database tables exist
    await ensureTablesCreated();

    // 4. Save to Turso database
    const recordId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `contact_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await db.insert(contactSubmissions).values({
      id: recordId,
      name: validData.name,
      email: validData.email,
      subject: validData.subject || null,
      message: validData.message,
      status: 'new',
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for reaching out! We have received your message and will be in touch soon.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred while saving your message. Please try again or email us directly at hello@nasfon.com.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
