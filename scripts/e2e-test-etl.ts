#!/usr/bin/env bun
/**
 * End-to-End ETL Test
 *
 * Complete test scenario:
 * 1. Setup: Create test league in database
 * 2. Extract: Fetch data from Fantrax
 * 3. Transform: Convert to our schema
 * 4. Load: Insert into database
 * 5. Verify: Query and validate results
 */

import { db } from '../lib/db';
import { leagues, users, fantasyTeams, players, rosters } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { runFantraxETL } from '../lib/etl/orchestrator';

async function runE2ETest() {
  console.log('🧪 End-to-End ETL Pipeline Test\n');
  console.log('=' .repeat(70));

  // Check prerequisites
  const cookie = process.env.FANTRAX_COOKIE;
  if (!cookie) {
    console.error('❌ FANTRAX_COOKIE environment variable not set');
    process.exit(1);
  }

  if (!db) {
    console.error('❌ Database not configured');
    process.exit(1);
  }

  const testLeagueId = 'e2e-test-league';
  const testUserId = 'e2e-test-user';
  const fantraxLeagueId = '6yvek7rfma1rhfum'; // Your RDHL league

  try {
    // ============================================================
    // STEP 1: SETUP - Create test league
    // ============================================================
    console.log('\n📋 STEP 1: Database Setup');
    console.log('─'.repeat(70));

    // Create test user (league commissioner)
    console.log('  Creating test user...');
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId))
      .limit(1);

    if (existingUser) {
      console.log('  ✅ Test user already exists');
    } else {
      await db.insert(users).values({
        id: testUserId,
        email: 'test@e2e.local',
        name: 'E2E Test User',
      });
      console.log('  ✅ Created test user');
    }

    // Create test league
    console.log('  Creating test league...');
    const [existingLeague] = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, testLeagueId))
      .limit(1);

    if (existingLeague) {
      console.log('  ✅ Test league already exists');
    } else {
      await db.insert(leagues).values({
        id: testLeagueId,
        name: 'E2E Test League',
        commissionerId: testUserId,
        scoringType: 'points',
        maxTeams: 20,
        rosterSize: 23,
        startDate: new Date('2024-10-01'),
      });
      console.log('  ✅ Created test league');
    }

    // ============================================================
    // STEP 2-5: RUN ETL PIPELINE
    // ============================================================
    console.log('\n📋 STEP 2-5: Running ETL Pipeline');
    console.log('─'.repeat(70));
    console.log('  This will:');
    console.log('    • Fetch teams from Fantrax');
    console.log('    • Fetch rosters and players');
    console.log('    • Transform data to our schema');
    console.log('    • Load into database');
    console.log('');

    const startTime = Date.now();
    const result = await runFantraxETL({
      leagueId: testLeagueId,
      fantraxLeagueId,
      cookie,
      syncRosters: true,
      clearExistingRosters: true,
    });

    if (!result.success) {
      console.error('\n❌ ETL Pipeline FAILED!');
      console.error('Errors:', result.errors);
      process.exit(1);
    }

    const duration = Date.now() - startTime;

    // ============================================================
    // STEP 6: VERIFY - Check database
    // ============================================================
    console.log('\n📋 STEP 6: Verification');
    console.log('─'.repeat(70));

    // Count records
    console.log('  Querying database...\n');

    const dbFantasyTeams = await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.leagueId, testLeagueId));

    const dbPlayers = await db
      .select()
      .from(players);

    const dbRosters = await db
      .select()
      .from(rosters);

    // ============================================================
    // RESULTS
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('🎉 END-TO-END TEST PASSED!');
    console.log('='.repeat(70));

    console.log('\n📊 ETL Pipeline Statistics:');
    console.log(`  Duration: ${(duration / 1000).toFixed(2)}s\n`);

    console.log('  Fantasy Teams:');
    console.log(`    Fetched:  ${result.stats.teams.fetched}`);
    console.log(`    Inserted: ${result.stats.teams.inserted}`);
    console.log(`    Updated:  ${result.stats.teams.updated}`);
    console.log(`    Failed:   ${result.stats.teams.failed}`);

    console.log('\n  Players:');
    console.log(`    Fetched:  ${result.stats.players.fetched}`);
    console.log(`    Inserted: ${result.stats.players.inserted}`);
    console.log(`    Updated:  ${result.stats.players.updated}`);
    console.log(`    Failed:   ${result.stats.players.failed}`);

    console.log('\n  Rosters:');
    console.log(`    Inserted: ${result.stats.rosters.inserted}`);
    console.log(`    Updated:  ${result.stats.rosters.updated}`);
    console.log(`    Cleared:  ${result.stats.rosters.cleared}`);
    console.log(`    Failed:   ${result.stats.rosters.failed}`);

    console.log('\n📦 Database Verification:');
    console.log(`  Fantasy Teams in DB: ${dbFantasyTeams.length}`);
    console.log(`  Players in DB:       ${dbPlayers.length}`);
    console.log(`  Roster Entries:      ${dbRosters.length}`);

    // Show sample data
    console.log('\n🔍 Sample Data:');
    console.log('\n  First 5 Fantasy Teams:');
    dbFantasyTeams.slice(0, 5).forEach((team, i) => {
      console.log(`    ${i + 1}. ${team.name} (${team.abbreviation}) - Owner: ${team.ownerId}`);
    });

    console.log('\n  First 5 Players:');
    dbPlayers.slice(0, 5).forEach((player, i) => {
      console.log(`    ${i + 1}. ${player.name} (${player.position}) - ${player.teamId || 'FA'}`);
    });

    console.log('\n  Roster Breakdown by Team:');
    const rosterCounts = dbFantasyTeams.map(team => {
      const count = dbRosters.filter(r => r.fantasyTeamId === team.id).length;
      return { name: team.name, count };
    }).slice(0, 5);

    rosterCounts.forEach(({ name, count }) => {
      console.log(`    ${name}: ${count} players`);
    });

    // Warnings
    if (result.errors.length > 0) {
      console.log(`\n⚠️  Warnings (${result.errors.length}):`);
      result.errors.slice(0, 5).forEach(error => {
        console.log(`  • ${error}`);
      });
      if (result.errors.length > 5) {
        console.log(`  ... and ${result.errors.length - 5} more`);
      }
    }

    // Final validation
    console.log('\n✅ Validation Checks:');
    const checks = [
      {
        name: 'Fantasy teams loaded',
        pass: dbFantasyTeams.length === result.stats.teams.fetched,
        expected: result.stats.teams.fetched,
        actual: dbFantasyTeams.length,
      },
      {
        name: 'Players loaded',
        pass: dbPlayers.length >= result.stats.players.fetched,
        expected: `>= ${result.stats.players.fetched}`,
        actual: dbPlayers.length,
      },
      {
        name: 'Rosters loaded',
        pass: dbRosters.length > 0,
        expected: '> 0',
        actual: dbRosters.length,
      },
    ];

    checks.forEach(check => {
      const icon = check.pass ? '✅' : '❌';
      console.log(`  ${icon} ${check.name}: ${check.actual} (expected: ${check.expected})`);
    });

    const allPassed = checks.every(c => c.pass);

    console.log('\n' + '='.repeat(70));
    if (allPassed) {
      console.log('🎊 ALL CHECKS PASSED! ETL Pipeline is fully functional!');
      console.log('='.repeat(70));
      console.log('\n✨ Next Steps:');
      console.log('  • View data: bun run db:studio');
      console.log('  • Test API: POST /api/admin/etl/fantrax');
      console.log('  • Add Vercel Cron for daily updates');
      console.log('  • Build admin UI for manual sync\n');
    } else {
      console.log('⚠️  SOME CHECKS FAILED - Review warnings above');
      console.log('='.repeat(70));
    }

  } catch (error: any) {
    console.error('\n💥 Test failed with exception:');
    console.error('Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
runE2ETest().catch(console.error);
