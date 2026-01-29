#!/usr/bin/env bun
/**
 * Debug script to see raw Fantrax API responses
 * This helps us fix parsing issues in the client
 */

import { FantraxAPIClient } from '../lib/etl/clients/fantrax';
import { writeFileSync } from 'fs';

async function debugFantraxAPI() {
  console.log('🔍 Debugging Fantrax API Responses\n');

  const cookie = process.env.FANTRAX_COOKIE;
  if (!cookie) {
    console.error('❌ FANTRAX_COOKIE not set');
    process.exit(1);
  }

  const client = new FantraxAPIClient({
    leagueId: '6yvek7rfma1rhfum',
    cookie,
  });

  try {
    // Get raw teams response
    console.log('📋 Fetching teams (raw response)...');
    const teamsResponse = await (client as any).request('getFantasyTeams');
    writeFileSync(
      'debug-teams-response.json',
      JSON.stringify(teamsResponse, null, 2)
    );
    console.log('✅ Saved to debug-teams-response.json');

    // Get raw roster response for first team
    if (teamsResponse.fantasyTeams?.[0]) {
      const firstTeamId = teamsResponse.fantasyTeams[0].id;
      console.log(`\n📋 Fetching roster for team ${firstTeamId} (raw response)...`);
      const rosterResponse = await (client as any).request('getTeamRosterInfo', {
        teamId: firstTeamId,
      });
      writeFileSync(
        'debug-roster-response.json',
        JSON.stringify(rosterResponse, null, 2)
      );
      console.log('✅ Saved to debug-roster-response.json');

      // Show sample player structure
      console.log('\n🔍 Sample player data structure:');
      const firstTable = rosterResponse.tables?.[0];
      const firstRow = firstTable?.rows?.find((r: any) => r.scorer);
      if (firstRow) {
        console.log('\nFull row structure:');
        console.log(JSON.stringify(firstRow, null, 2));

        console.log('\n\nKey fields:');
        console.log('  scorer:', firstRow.scorer ? 'present' : 'missing');
        console.log('  fppg:', firstRow.fppg);
        console.log('  posId:', firstRow.posId);
        console.log('  statusId:', firstRow.statusId);

        if (firstRow.scorer) {
          console.log('\n  Player fields:');
          console.log('    scorerId:', firstRow.scorer.scorerId);
          console.log('    name:', firstRow.scorer.name);
          console.log('    shortName:', firstRow.scorer.shortName);
          console.log('    posShortNames:', firstRow.scorer.posShortNames);
          console.log('    teamName:', firstRow.scorer.teamName);
          console.log('    teamShortName:', firstRow.scorer.teamShortName);
        }
      }
    }

    // Get raw standings
    console.log('\n\n📋 Fetching standings (raw response)...');
    const standingsResponse = await (client as any).request('getStandings');
    writeFileSync(
      'debug-standings-response.json',
      JSON.stringify(standingsResponse, null, 2)
    );
    console.log('✅ Saved to debug-standings-response.json');

    console.log('\n\n✅ Debug files created!');
    console.log('\n📝 Check these files to understand the API structure:');
    console.log('  • debug-teams-response.json');
    console.log('  • debug-roster-response.json');
    console.log('  • debug-standings-response.json');
    console.log('\nLook for:');
    console.log('  1. Where owner info is located in teams response');
    console.log('  2. How FPPG is actually stored (might be object or different field)');
    console.log('  3. Position format (F vs C/LW/RW)');

  } catch (error: any) {
    console.error('\n❌ Debug failed:', error.message);
    process.exit(1);
  }
}

debugFantraxAPI().catch(console.error);
