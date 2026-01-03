import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Only initialize if DATABASE_URL is set (for development without DB)
let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  // Disable prefetch as it is not supported for "Transaction" pool mode
  client = postgres(process.env.DATABASE_URL, { prepare: false });
  db = drizzle(client, { schema });
} else {
  console.warn('DATABASE_URL not set - database features will be unavailable');
}

export { db };

