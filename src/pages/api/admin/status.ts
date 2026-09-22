import type { APIRoute } from 'astro';
import { db, ensureTablesCreated } from '../../../db';
import { contactSubmissions, projectApplications } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { isValidAdminSession } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isValidAdminSession(cookies)) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { id, type, status, action } = await request.json();

    if (!id || !type) {
      return new Response(JSON.stringify({ success: false, message: 'Missing parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await ensureTablesCreated();

    // 1. Delete Action
    if (action === 'delete') {
      if (type === 'contact') {
        await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
      } else if (type === 'application') {
        await db.delete(projectApplications).where(eq(projectApplications.id, id));
      } else {
        return new Response(JSON.stringify({ success: false, message: 'Invalid type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Submission deleted' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Status Update Action
    if (!status) {
      return new Response(JSON.stringify({ success: false, message: 'Status is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (type === 'contact') {
      await db.update(contactSubmissions)
        .set({ status })
        .where(eq(contactSubmissions.id, id));
    } else if (type === 'application') {
      await db.update(projectApplications)
        .set({ status })
        .where(eq(projectApplications.id, id));
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Invalid type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Status updated' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling admin action:', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
