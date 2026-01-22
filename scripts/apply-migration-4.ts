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
    console.log('Applying migration 4 (leagues, fantasy teams, rosters)...');

    // Create enums (ignore error if they already exist)
    try {
      await sql`CREATE TYPE "draft_type" AS ENUM('snake', 'auction');`;
      console.log('✓ Created draft_type enum');
    } catch (e: any) {
      if (e.code === '42P07') {
        console.log('✓ draft_type enum already exists');
      } else {
        throw e;
      }
    }
    
    try {
      await sql`CREATE TYPE "league_status" AS ENUM('draft', 'active', 'completed');`;
      console.log('✓ Created league_status enum');
    } catch (e: any) {
      if (e.code === '42P07') {
        console.log('✓ league_status enum already exists');
      } else {
        throw e;
      }
    }

    // Create leagues table
    await sql`
      CREATE TABLE "leagues" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "commissioner_id" text NOT NULL,
        "status" "league_status" DEFAULT 'draft',
        "max_teams" integer DEFAULT 12,
        "draft_type" "draft_type" DEFAULT 'snake',
        "scoring_settings" text,
        "roster_size" integer DEFAULT 20,
        "draft_date" timestamp,
        "draft_order" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;
    console.log('✓ Created leagues table');

    // Create fantasy_teams table
    await sql`
      CREATE TABLE "fantasy_teams" (
        "id" text PRIMARY KEY NOT NULL,
        "league_id" text NOT NULL,
        "owner_id" text NOT NULL,
        "name" text NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;
    console.log('✓ Created fantasy_teams table');

    // Create league_memberships table
    await sql`
      CREATE TABLE "league_memberships" (
        "id" text PRIMARY KEY NOT NULL,
        "league_id" text NOT NULL,
        "user_id" text NOT NULL,
        "joined_at" timestamp DEFAULT now()
      );
    `;
    console.log('✓ Created league_memberships table');

    // Create rosters table
    await sql`
      CREATE TABLE "rosters" (
        "id" text PRIMARY KEY NOT NULL,
        "fantasy_team_id" text NOT NULL,
        "player_id" text NOT NULL,
        "lineup_position" text,
        "added_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;
    console.log('✓ Created rosters table');

    // Add foreign keys (ignore error if they already exist)
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

    await addForeignKey('fantasy_teams', 'fantasy_teams_league_id_leagues_id_fk', 'league_id', 'leagues');
    await addForeignKey('fantasy_teams', 'fantasy_teams_owner_id_users_id_fk', 'owner_id', 'users');
    await addForeignKey('league_memberships', 'league_memberships_league_id_leagues_id_fk', 'league_id', 'leagues');
    await addForeignKey('league_memberships', 'league_memberships_user_id_users_id_fk', 'user_id', 'users');
    await addForeignKey('leagues', 'leagues_commissioner_id_users_id_fk', 'commissioner_id', 'users');
    await addForeignKey('rosters', 'rosters_fantasy_team_id_fantasy_teams_id_fk', 'fantasy_team_id', 'fantasy_teams');
    await addForeignKey('rosters', 'rosters_player_id_players_id_fk', 'player_id', 'players');

    console.log('✅ Migration 4 applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();
