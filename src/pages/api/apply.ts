import type { APIRoute } from 'astro';
import { db, ensureTablesCreated } from '../../db';
import { projectApplications } from '../../db/schema';
import { applicationSchema } from '../../lib/validation';
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
          message: 'Thank you for your project application! We will review it shortly.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate input with Zod
    const validationResult = applicationSchema.safeParse(rawData);
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
          message: 'Please review the highlighted fields in your application.',
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
      : `apply_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await db.insert(projectApplications).values({
      id: recordId,
      clientName: validData.clientName,
      companyName: validData.companyName || null,
      email: validData.email,
      phone: validData.phone || null,
      serviceType: validData.serviceType,
      budgetRange: validData.budgetRange || null,
      timeline: validData.timeline || null,
      description: validData.description,
      status: 'pending',
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your project application has been received. Our team will review the details and reach out within 24–48 business hours.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing project application submission:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred while submitting your application. Please try again or reach us at hello@nasfon.com.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
