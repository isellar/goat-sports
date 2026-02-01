#!/usr/bin/env bun
/**
 * Test script for Fantrax ETL Pipeline
 *
 * Usage:
 *   bun run scripts/test-etl.ts
 *
 * Required env vars:
 *   FANTRAX_COOKIE - Your Fantrax session cookie
 *   DATABASE_URL - Your database connection string
 *
 * This will:
 *   1. Fetch data from your Fantrax league
 *   2. Transform it to match our schema
 *   3. Load it into the database
 */

import { runFantraxETL } from '../lib/etl/orchestrator';
import { db } from '../lib/db';

async function testETL() {
  console.log('🧪 Testing Fantrax ETL Pipeline\n');
  console.log('=' .repeat(60));

  // Check for required env vars
  const cookie = process.env.FANTRAX_COOKIE;
  if (!cookie) {
    console.error('❌ Error: FANTRAX_COOKIE environment variable not set');
    process.exit(1);
  }

  if (!db) {
    console.error('❌ Error: Database not configured (check DATABASE_URL)');
    process.exit(1);
  }

  try {
    // Run the ETL pipeline
    const result = await runFantraxETL({
      leagueId: 'test-league-1', // Create this league in your DB first
      fantraxLeagueId: '6yvek7rfma1rhfum', // Your RDHL league
      cookie,
      syncRosters: true,
      clearExistingRosters: true,
    });

    console.log('\n' + '='.repeat(60));

    if (result.success) {
      console.log('✅ ETL Pipeline Test PASSED!\n');
      console.log('📊 Statistics:');
      console.log(`  Duration: ${(result.duration / 1000).toFixed(2)}s`);
      console.log(`\n  Teams:`);
      console.log(`    Fetched: ${result.stats.teams.fetched}`);
      console.log(`    Inserted: ${result.stats.teams.inserted}`);
      console.log(`    Updated: ${result.stats.teams.updated}`);
      console.log(`    Failed: ${result.stats.teams.failed}`);
      console.log(`\n  Players:`);
      console.log(`    Fetched: ${result.stats.players.fetched}`);
      console.log(`    Inserted: ${result.stats.players.inserted}`);
      console.log(`    Updated: ${result.stats.players.updated}`);
      console.log(`    Failed: ${result.stats.players.failed}`);
      console.log(`\n  Rosters:`);
      console.log(`    Inserted: ${result.stats.rosters.inserted}`);
      console.log(`    Updated: ${result.stats.rosters.updated}`);
      console.log(`    Cleared: ${result.stats.rosters.cleared}`);
      console.log(`    Failed: ${result.stats.rosters.failed}`);

      if (result.errors.length > 0) {
        console.log(`\n⚠️  Warnings (${result.errors.length}):`);
        result.errors.slice(0, 5).forEach(error => {
          console.log(`  • ${error}`);
        });
        if (result.errors.length > 5) {
          console.log(`  ... and ${result.errors.length - 5} more`);
        }
      }

      console.log('\n🎉 ETL pipeline is working correctly!');
      console.log('\nNext steps:');
      console.log('  • Verify data in database (bun run db:studio)');
      console.log('  • Set up Vercel Cron for automated updates');
      console.log('  • Add admin UI for manual sync triggers');

    } else {
      console.error('❌ ETL Pipeline Test FAILED!\n');
      console.error('Errors:');
      result.errors.forEach(error => {
        console.error(`  • ${error}`);
      });
      process.exit(1);
    }

  } catch (error: any) {
    console.error('\n❌ Test failed with exception:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run test
testETL().catch(console.error);
