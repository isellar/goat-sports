import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get DATABASE_URL - handle both quoted and unquoted values
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  // Remove surrounding quotes if present
  return url.replace(/^["']|["']$/g, '');
};

// Lazy initialization - only create connection when first accessed
let client: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;
let initialized = false;

const getDb = () => {
  if (dbInstance) return dbInstance;
  if (initialized) return null; // Already tried and failed
  
  initialized = true;
  const databaseUrl = getDatabaseUrl();
  if (databaseUrl) {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    client = postgres(databaseUrl, { prepare: false });
    dbInstance = drizzle(client, { schema });
    return dbInstance;
  } else {
    console.warn('DATABASE_URL not set - database features will be unavailable');
    return null;
  }
};

// Export a proxy that lazily initializes on first property access
export const db = new Proxy({} as any, {
  get(target, prop) {
    const db = getDb();
    if (!db) {
      if (prop === 'then') return undefined; // Handle optional chaining
      return null;
    }
    const value = (db as any)[prop];
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  }
}) as ReturnType<typeof drizzle> | null;

