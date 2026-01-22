// CRITICAL: Load environment variables FIRST using require (synchronous)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

import postgres from 'postgres';

async function applyMigration() {
  const client = postgres(process.env.DATABASE_URL!.replace(/^["']|["']$/g, ''), { prepare: false });

  try {
    console.log('Applying migration 3...');

    // Add heat and trend score columns
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS heat_score integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS trend_score integer DEFAULT 0;`;
    console.log('✓ Added heat_score and trend_score columns');

    console.log('✅ Migration 3 applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

applyMigration();



