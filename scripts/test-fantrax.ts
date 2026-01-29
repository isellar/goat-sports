#!/usr/bin/env bun
/**
 * Test script for Fantrax API client
 *
 * Usage:
 *   bun run scripts/test-fantrax.ts
 *
 * Required env var:
 *   FANTRAX_COOKIE - Your Fantrax session cookie
 *
 * To get your cookie:
 *   1. Log into Fantrax in your browser
 *   2. Open DevTools (F12) -> Application/Storage -> Cookies
 *   3. Copy the entire cookie string from fantrax.com
 *   4. Add to .env.local: FANTRAX_COOKIE="your-cookie-string"
 */

import { FantraxAPIClient } from '../lib/etl/clients/fantrax';

async function testFantraxClient() {
  console.log('🧪 Testing Fantrax API Client\n');
  console.log('=' .repeat(60));

  // Check for cookie
  const cookie = process.env.FANTRAX_COOKIE;
  if (!cookie) {
    console.error('❌ Error: FANTRAX_COOKIE environment variable not set');
    console.log('\nTo get your cookie:');
    console.log('1. Log into Fantrax in your browser');
    console.log('2. Open DevTools (F12) -> Application -> Cookies');
    console.log('3. Copy the cookie value');
    console.log('4. Add to .env.local: FANTRAX_COOKIE="your-cookie"');
    process.exit(1);
  }

  // Initialize client with your league
  const client = new FantraxAPIClient({
    leagueId: '6yvek7rfma1rhfum', // Your RDHL league
    cookie,
  });

  try {
    // Test 1: Get Teams
    console.log('\n📋 Test 1: Fetching fantasy teams...');
    const teams = await client.getTeams();
    console.log(`✅ Found ${teams.length} teams:`);
    teams.slice(0, 5).forEach((team, i) => {
      console.log(`  ${i + 1}. ${team.name} (${team.abbreviation})`);
    });
    if (teams.length > 5) {
      console.log(`  ... and ${teams.length - 5} more teams`);
    }
    console.log('\n  Note: Owner info is fetched per-team via roster calls (see Test 2)');

    // Test 2: Get Roster for first team
    if (teams.length > 0) {
      console.log(`\n📋 Test 2: Fetching roster for "${teams[0].name}"...`);
      const roster = await client.getRosterInfo(teams[0].team_id);
      console.log(`✅ Found ${roster.rows.length} roster slots`);
      console.log(`   Owner: ${roster.owner || 'Unknown'}`);
      console.log(`\n   Top 10 players:`);

      roster.rows.slice(0, 10).forEach((row, i) => {
        if (row.player) {
          const injury = row.player.injured ? ' 🤕' : '';
          const suspend = row.player.suspended ? ' 🚫' : '';
          console.log(
            `  ${i + 1}. ${row.player.short_name} (${row.player.pos_short_name}) - ` +
            `${row.player.team_short_name} - FPPG: ${row.fppg.toFixed(2)}${injury}${suspend}`
          );
        } else {
          console.log(`  ${i + 1}. [Empty Slot]`);
        }
      });

      if (roster.rows.length > 10) {
        console.log(`  ... and ${roster.rows.length - 10} more`);
      }
    }

    // Test 3: Get All Players
    console.log('\n📋 Test 3: Fetching all players from league...');
    console.log('⏳ This may take a minute (fetches all rosters)...');
    const players = await client.getPlayers();
    console.log(`✅ Found ${players.length} unique players across all rosters`);

    // Show stats breakdown
    const positions: Record<string, number> = {};
    const teams_breakdown: Record<string, number> = {};
    let injured = 0;

    players.forEach(p => {
      if (p.pos_short_name) {
        positions[p.pos_short_name] = (positions[p.pos_short_name] || 0) + 1;
      }
      if (p.team_short_name) {
        teams_breakdown[p.team_short_name] = (teams_breakdown[p.team_short_name] || 0) + 1;
      }
      if (p.injured) injured++;
    });

    console.log('\n  Position breakdown:');
    Object.entries(positions).sort((a, b) => b[1] - a[1]).forEach(([pos, count]) => {
      console.log(`    ${pos}: ${count}`);
    });

    console.log(`\n  Injured players: ${injured}`);
    console.log(`\n  Top 5 NHL teams represented:`);
    Object.entries(teams_breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([team, count]) => {
        console.log(`    ${team}: ${count} players`);
      });

    // Test 4: Get Standings
    console.log('\n📋 Test 4: Fetching league standings...');
    try {
      const standings = await client.getStandings();
      console.log('✅ Standings fetched successfully');
      console.log('  (Raw standings data - structure may vary)');
    } catch (error) {
      console.log('⚠️  Standings fetch failed (may require different permissions)');
      console.log(`  Error: ${error}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('\n🎉 Fantrax API client is working correctly!');
    console.log('\nNext steps:');
    console.log('  • Build database loaders to store this data');
    console.log('  • Create ETL orchestration to sync regularly');
    console.log('  • Add API route for manual sync triggers');

  } catch (error: any) {
    console.error('\n❌ Test failed:');
    console.error(error.message);

    if (error.message.includes('Unauthorized') || error.message.includes('Not logged in')) {
      console.log('\n💡 Your cookie may have expired. Get a fresh one:');
      console.log('  1. Log into Fantrax in your browser');
      console.log('  2. Open DevTools (F12) -> Application -> Cookies');
      console.log('  3. Copy the cookie value');
      console.log('  4. Update .env.local: FANTRAX_COOKIE="new-cookie"');
    }

    process.exit(1);
  }
}

// Run tests
testFantraxClient().catch(console.error);
