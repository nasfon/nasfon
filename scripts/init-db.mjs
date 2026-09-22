import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log('Connecting to Turso database:', process.env.TURSO_DATABASE_URL);

  // 1. Create contact_submissions table
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
  console.log('✓ contact_submissions table is ready');

  // 2. Create project_applications table
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
  console.log('✓ project_applications table is ready');

  // 3. Inspect existing tables in the database
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.log('Tables currently in Turso:', tables.rows.map(r => r.name));
}

main().catch(err => {
  console.error('Error connecting to Turso:', err);
  process.exit(1);
});
