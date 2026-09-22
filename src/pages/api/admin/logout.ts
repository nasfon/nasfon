import type { APIRoute } from 'astro';
import { clearAdminSession } from '../../../lib/auth';

export const prerender = false;

export const ALL: APIRoute = async ({ cookies, redirect }) => {
  clearAdminSession(cookies);
  return redirect('/admin/login');
};
