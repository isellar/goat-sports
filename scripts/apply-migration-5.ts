// CRITICAL: Load environment variables FIRST using require (synchronous)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

import postgres from 'postgres';

async function applyMigration() {
  const databaseUrl = process.env.DATABASE_URL?.replace(/^["']|["']$/g, '');

  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL not found. Please set it in your .env file.');
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { max: 1 });

  try {
    console.log('Applying migration 5 (drafts and draft_picks)...');

    // Create enum
    try {
      await sql`CREATE TYPE "draft_status" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled');`;
      console.log('✓ Created draft_status enum');
    } catch (e: any) {
      if (e.code === '42P07') {
        console.log('✓ draft_status enum already exists');
      } else {
        throw e;
      }
    }

    // Create drafts table
    await sql`
      CREATE TABLE "drafts" (
        "id" text PRIMARY KEY NOT NULL,
        "league_id" text NOT NULL,
        "status" "draft_status" DEFAULT 'scheduled',
        "draft_order" text,
        "current_pick" integer DEFAULT 1,
        "current_team_id" text,
        "pick_time_limit" integer,
        "started_at" timestamp,
        "completed_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;
    console.log('✓ Created drafts table');

    // Create draft_picks table
    await sql`
      CREATE TABLE "draft_picks" (
        "id" text PRIMARY KEY NOT NULL,
        "draft_id" text NOT NULL,
        "pick_number" integer NOT NULL,
        "team_id" text NOT NULL,
        "player_id" text NOT NULL,
        "bid_amount" integer,
        "picked_at" timestamp DEFAULT now(),
        "created_at" timestamp DEFAULT now()
      );
    `;
    console.log('✓ Created draft_picks table');

    // Add foreign keys
    const addForeignKey = async (table: string, constraint: string, fk: string, ref: string) => {
      try {
        await sql.unsafe(`
          ALTER TABLE "${table}" 
          ADD CONSTRAINT "${constraint}" 
          FOREIGN KEY ("${fk}") REFERENCES "public"."${ref}"("id") ON DELETE no action ON UPDATE no action;
        `);
        console.log(`✓ Added ${table}.${fk} foreign key`);
      } catch (e: any) {
        if (e.code === '42P16' || e.code === '42710') {
          console.log(`✓ ${table}.${fk} foreign key already exists`);
        } else {
          throw e;
        }
      }
    };

    await addForeignKey('drafts', 'drafts_league_id_leagues_id_fk', 'league_id', 'leagues');
    await addForeignKey('drafts', 'drafts_current_team_id_fantasy_teams_id_fk', 'current_team_id', 'fantasy_teams');
    await addForeignKey('draft_picks', 'draft_picks_draft_id_drafts_id_fk', 'draft_id', 'drafts');
    await addForeignKey('draft_picks', 'draft_picks_team_id_fantasy_teams_id_fk', 'team_id', 'fantasy_teams');
    await addForeignKey('draft_picks', 'draft_picks_player_id_players_id_fk', 'player_id', 'players');

    // Add unique constraint for league_id
    try {
      await sql`ALTER TABLE "drafts" ADD CONSTRAINT "drafts_league_id_unique" UNIQUE ("league_id");`;
      console.log('✓ Added unique constraint on drafts.league_id');
    } catch (e: any) {
      if (e.code === '42P16' || e.code === '42710') {
        console.log('✓ Unique constraint on drafts.league_id already exists');
      } else {
        throw e;
      }
    }

    console.log('✅ Migration 5 applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();
