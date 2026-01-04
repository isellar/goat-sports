// CRITICAL: Load environment variables FIRST using require (synchronous)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

import postgres from 'postgres';

async function applyMigration() {
  const client = postgres(process.env.DATABASE_URL!.replace(/^["']|["']$/g, ''), { prepare: false });

  try {
    console.log('Applying migration 2...');

    // Add new skater stats columns
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS penalty_minutes integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS shots_on_goal integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS power_play_points integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS short_handed_points integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS hits integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS blocks integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS takeaways integer DEFAULT 0;`;
    console.log('✓ Added skater stats columns');

    // Add new goalie stats columns
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS overtime_wins integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS overtime_losses integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS shootout_losses integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS goals_against integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS saves integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS shootout_wins integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS goalie_goals integer DEFAULT 0;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS goalie_assists integer DEFAULT 0;`;
    console.log('✓ Added goalie stats columns');

    // Add ranking columns
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS position_rank integer;`;
    await client`ALTER TABLE players ADD COLUMN IF NOT EXISTS position_rank_last_10 integer;`;
    console.log('✓ Added ranking columns');

    console.log('✅ Migration 2 applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

applyMigration();

