#!/usr/bin/env bun
import { db } from '../lib/db';
import { fantasyTeams, players, rosters, leagues } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const league = await db.select().from(leagues).where(eq(leagues.id, 'e2e-test-league'));
const teams = await db.select().from(fantasyTeams).where(eq(fantasyTeams.leagueId, 'e2e-test-league'));
const allPlayers = await db.select().from(players);
const allRosters = await db.select().from(rosters);

console.log('📊 ETL Status Check\n');
console.log('='.repeat(70));
console.log('\n✅ League:', league[0]?.name || 'Not found');
console.log('\n✅ Fantasy Teams:', teams.length);
teams.slice(0, 5).forEach((t, i) => {
  console.log(`  ${i+1}. ${t.name} (${t.abbreviation})`);
});

console.log('\n✅ Players:', allPlayers.length);
allPlayers.slice(0, 5).forEach((p, i) => {
  console.log(`  ${i+1}. ${p.name} (${p.position})`);
});

console.log('\n✅ Roster Entries:', allRosters.length);
console.log('\n' + '='.repeat(70));
