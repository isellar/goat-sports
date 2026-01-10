import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database client for GOAT Sports
 * 
 * Uses Drizzle ORM with PostgreSQL via postgres-js.
 * Lazy initialization - only connects when first accessed.
 * 
 * @example
 * ```typescript
 * import { db } from '@/lib/db';
 * import { players } from '@/lib/db/schema';
 * 
 * const allPlayers = await db.select().from(players);
 * ```
 * 
 * @remarks
 * - Returns null if DATABASE_URL is not configured
 * - All database operations should check for null before use
 * - Types are automatically inferred from schema
 */

/**
 * Get DATABASE_URL from environment, handling quoted values
 * @returns Database connection string or null if not set
 */
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

/**
 * Get or initialize the database instance
 * @returns Drizzle database instance or null if connection failed
 */
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

/**
 * Database client - lazily initialized Drizzle instance
 * 
 * This is a proxy that initializes the database connection on first access.
 * Returns null if DATABASE_URL is not configured.
 * 
 * @example
 * ```typescript
 * if (!db) {
 *   return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
 * }
 * 
 * const players = await db.select().from(players);
 * ```
 */
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

