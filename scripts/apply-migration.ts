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
    console.log('Applying migration...');

    // Add date_of_birth column if it doesn't exist
    await client`
      ALTER TABLE players ADD COLUMN IF NOT EXISTS date_of_birth timestamp;
    `;
    console.log('✓ Added date_of_birth column');

    // Create games table if it doesn't exist
    await client`
      CREATE TABLE IF NOT EXISTS games (
        id text PRIMARY KEY NOT NULL,
        home_team_id text NOT NULL,
        away_team_id text NOT NULL,
        game_date timestamp NOT NULL,
        status game_status DEFAULT 'scheduled',
        home_score integer,
        away_score integer,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );
    `;
    console.log('✓ Created games table');

    // Add foreign keys if they don't exist
    await client`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'games_home_team_id_teams_id_fk'
        ) THEN
          ALTER TABLE games ADD CONSTRAINT games_home_team_id_teams_id_fk 
          FOREIGN KEY (home_team_id) REFERENCES teams(id) 
          ON DELETE no action ON UPDATE no action;
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'games_away_team_id_teams_id_fk'
        ) THEN
          ALTER TABLE games ADD CONSTRAINT games_away_team_id_teams_id_fk 
          FOREIGN KEY (away_team_id) REFERENCES teams(id) 
          ON DELETE no action ON UPDATE no action;
        END IF;
      END $$;
    `;
    console.log('✓ Added foreign key constraints');

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

