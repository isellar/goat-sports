// CRITICAL: Load environment variables FIRST using require (synchronous)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

import { db } from '../lib/db';
import postgres from 'postgres';

async function applyMigration() {
  if (!db) {
    console.error('Database not configured');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL!.replace(/^["']|["']$/g, ''), { prepare: false });

  try {
    console.log('Applying profiles table migration...');

    // Create profiles table if it doesn't exist
    await client`
      CREATE TABLE IF NOT EXISTS profiles (
        id text PRIMARY KEY NOT NULL,
        user_id text NOT NULL,
        display_name text,
        avatar_url text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now(),
        CONSTRAINT profiles_user_id_unique UNIQUE(user_id)
      );
    `;
    console.log('✓ Created profiles table');

    console.log('✅ Migration applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

applyMigration();
