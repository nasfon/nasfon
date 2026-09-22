import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

function getDbCredentials() {
  const url = process.env.TURSO_DATABASE_URL || (import.meta.env && import.meta.env.TURSO_DATABASE_URL);
  const authToken = process.env.TURSO_AUTH_TOKEN || (import.meta.env && import.meta.env.TURSO_AUTH_TOKEN);

  return {
    url: url || 'file:local.db',
    authToken: authToken || undefined,
  };
}

const credentials = getDbCredentials();

export const client = createClient({
  url: credentials.url,
  authToken: credentials.authToken,
});

export const db = drizzle(client, { schema });

/**
 * Initializes required tables in Turso / SQLite if they don't exist yet.
 * Safe to call at startup or within endpoint handlers.
 */
let isInitialized = false;

export async function ensureTablesCreated() {
  if (isInitialized) return;

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at INTEGER NOT NULL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS project_applications (
        id TEXT PRIMARY KEY,
        client_name TEXT NOT NULL,
        company_name TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        service_type TEXT NOT NULL,
        budget_range TEXT,
        timeline TEXT,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at INTEGER NOT NULL
      );
    `);

    isInitialized = true;
  } catch (error) {
    console.error('Failed to auto-initialize Turso database tables:', error);
    // Don't throw so app doesn't crash on read-only environments
  }
}
