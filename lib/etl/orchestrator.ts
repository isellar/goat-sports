/**
 * ETL Orchestration Service
 * Coordinates the full Extract → Transform → Load pipeline for Fantrax data
 */

import { FantraxAPIClient } from './clients/fantrax';
import { loadPlayers, loadFantasyTeams, loadMultipleRosters } from './loaders';
import type { FantraxRoster } from './types/fantrax';

export interface ETLResult {
  success: boolean;
  duration: number;
  stats: {
    teams: {
      fetched: number;
      inserted: number;
      updated: number;
      failed: number;
    };
    players: {
      fetched: number;
      inserted: number;
      updated: number;
      failed: number;
    };
    rosters: {
      inserted: number;
      updated: number;
      cleared: number;
      failed: number;
    };
  };
  errors: string[];
}

export interface ETLOptions {
  leagueId: string;
  fantraxLeagueId: string;
  cookie?: string;
  syncRosters?: boolean;
  clearExistingRosters?: boolean;
}

/**
 * Run the complete ETL pipeline for Fantrax data
 */
export async function runFantraxETL(options: ETLOptions): Promise<ETLResult> {
  const startTime = Date.now();

  const result: ETLResult = {
    success: false,
    duration: 0,
    stats: {
      teams: { fetched: 0, inserted: 0, updated: 0, failed: 0 },
      players: { fetched: 0, inserted: 0, updated: 0, failed: 0 },
      rosters: { inserted: 0, updated: 0, cleared: 0, failed: 0 },
    },
    errors: [],
  };

  try {
    console.log('🚀 Starting Fantrax ETL Pipeline...');
    console.log(`League ID: ${options.leagueId}`);
    console.log(`Fantrax League: ${options.fantraxLeagueId}\n`);

    // Initialize Fantrax API client
    const client = new FantraxAPIClient({
      leagueId: options.fantraxLeagueId,
      cookie: options.cookie,
    });

    // STEP 1: Extract - Fetch teams from Fantrax
    console.log('📥 Step 1: Extracting fantasy teams...');
    const fantraxTeams = await client.getTeams();
    result.stats.teams.fetched = fantraxTeams.length;
    console.log(`✅ Fetched ${fantraxTeams.length} teams\n`);

    // STEP 2: Extract - Fetch rosters to get owners and players
    console.log('📥 Step 2: Extracting rosters and players...');
    const rosters: FantraxRoster[] = [];
    const teamsWithOwners = [];

    for (const team of fantraxTeams) {
      console.log(`  Fetching roster for ${team.name}...`);
      const roster = await client.getRosterInfo(team.team_id);
      rosters.push(roster);

      // Add owner info to team
      teamsWithOwners.push({
        ...team,
        owner: roster.owner,
      });
    }

    // Get unique players from all rosters
    const allPlayers = await client.getPlayers();
    result.stats.players.fetched = allPlayers.length;
    console.log(`✅ Fetched ${allPlayers.length} unique players\n`);

    // STEP 3: Load - Insert/Update fantasy teams
    console.log('💾 Step 3: Loading fantasy teams into database...');
    const teamsResult = await loadFantasyTeams(teamsWithOwners, options.leagueId);
    result.stats.teams.inserted = teamsResult.inserted;
    result.stats.teams.updated = teamsResult.updated;
    result.stats.teams.failed = teamsResult.failed;

    if (teamsResult.errors.length > 0) {
      result.errors.push(...teamsResult.errors.map(e => `Team ${e.team}: ${e.error}`));
    }

    console.log(`✅ Teams: ${teamsResult.inserted} inserted, ${teamsResult.updated} updated\n`);

    // STEP 4: Load - Insert/Update players
    console.log('💾 Step 4: Loading players into database...');
    const playersResult = await loadPlayers(allPlayers);
    result.stats.players.inserted = playersResult.inserted;
    result.stats.players.updated = playersResult.updated;
    result.stats.players.failed = playersResult.failed;

    if (playersResult.errors.length > 0) {
      result.errors.push(...playersResult.errors.map(e => `Player ${e.player}: ${e.error}`));
    }

    console.log(
      `✅ Players: ${playersResult.inserted} inserted, ${playersResult.updated} updated\n`
    );

    // STEP 5: Load - Insert/Update rosters (optional)
    if (options.syncRosters) {
      console.log('💾 Step 5: Loading rosters into database...');
      const rostersResult = await loadMultipleRosters(rosters, {
        clearExisting: options.clearExistingRosters,
      });

      result.stats.rosters.inserted = rostersResult.inserted;
      result.stats.rosters.updated = rostersResult.updated;
      result.stats.rosters.cleared = rostersResult.cleared;
      result.stats.rosters.failed = rostersResult.failed;

      if (rostersResult.errors.length > 0) {
        result.errors.push(...rostersResult.errors.map(e => `Roster: ${e.error}`));
      }

      console.log(
        `✅ Rosters: ${rostersResult.inserted} inserted, ${rostersResult.updated} updated, ` +
        `${rostersResult.cleared} cleared\n`
      );
    }

    result.success = true;
    result.duration = Date.now() - startTime;

    console.log('🎉 ETL Pipeline completed successfully!');
    console.log(`Duration: ${(result.duration / 1000).toFixed(2)}s\n`);

  } catch (error: any) {
    result.success = false;
    result.duration = Date.now() - startTime;
    result.errors.push(`Pipeline failed: ${error.message}`);
    console.error('❌ ETL Pipeline failed:', error);
  }

  return result;
}
