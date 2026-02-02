/**
 * Roster Database Loader
 * Handles upserting roster entries (fantasy team -> player assignments)
 */

import { db } from '@/lib/db';
import { rosters } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { FantraxRoster } from '../types/fantrax';

export interface RosterLoadResult {
  inserted: number;
  updated: number;
  skipped: number;
  cleared: number;
  failed: number;
  errors: Array<{ team: string; player?: string; error: string }>;
}

/**
 * Load roster for a specific fantasy team
 * Replaces all existing roster entries for the team
 */
export async function loadTeamRoster(
  fantraxRoster: FantraxRoster,
  options: {
    clearExisting?: boolean;
  } = {}
): Promise<RosterLoadResult> {
  if (!db) {
    throw new Error('Database not configured');
  }

  const result: RosterLoadResult = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    cleared: 0,
    failed: 0,
    errors: [],
  };

  const fantasyTeamId = `fantrax_${fantraxRoster.team_id}`;

  try {
    // Clear existing roster if requested
    if (options.clearExisting) {
      const deleted = await db
        .delete(rosters)
        .where(eq(rosters.fantasyTeamId, fantasyTeamId));
      result.cleared = deleted.length || 0;
    }

    // Batch collect roster entries
    const rosterEntries = [];

    for (const row of fantraxRoster.rows) {
      // Skip empty slots
      if (!row.player) {
        result.skipped++;
        continue;
      }

      const playerId = `fantrax_${row.player.id}`;
      // Generate unique ID for roster entry
      const rosterId = `${fantasyTeamId}_${playerId}`;

      rosterEntries.push({
        id: rosterId,
        fantasyTeamId,
        playerId,
        lineupPosition: row.pos_id ? mapPositionIdToLineupPosition(row.pos_id) : null,
        addedAt: new Date(),
      });
    }

    // Batch insert roster entries (much faster!)
    if (rosterEntries.length > 0) {
      try {
        await db.insert(rosters).values(rosterEntries);
        result.inserted += rosterEntries.length;
      } catch (error: any) {
        // If batch insert fails, fall back to individual inserts
        for (const entry of rosterEntries) {
          try {
            await db.insert(rosters).values(entry);
            result.inserted++;
          } catch (err: any) {
            result.failed++;
            result.errors.push({
              team: fantraxRoster.team_id,
              player: entry.playerId,
              error: err.message,
            });
          }
        }
      }
    }
  } catch (error: any) {
    result.failed++;
    result.errors.push({
      team: fantraxRoster.team_id,
      error: error.message,
    });
  }

  return result;
}

/**
 * Map Fantrax position ID to our lineup position enum
 */
function mapPositionIdToLineupPosition(positionId: string): string | null {
  // Fantrax position IDs (from your data):
  // 201 = G (Goalie)
  // 207 = F (Forward)
  // Others may include D (Defense), Bench, etc.

  // Map to our schema's lineup positions
  const positionMap: Record<string, string> = {
    '201': 'G1',      // Goalie
    '202': 'G2',      // Goalie 2
    '203': 'C',       // Center
    '204': 'LW',      // Left Wing
    '205': 'RW',      // Right Wing
    '206': 'C',       // Another Center variant
    '207': 'F',       // Flex Forward
    '208': 'D1',      // Defense
    '209': 'D2',      // Defense 2
    '210': 'BENCH',   // Bench
    '211': 'IR',      // Injured Reserve
  };

  return positionMap[positionId] || null;
}

/**
 * Load rosters for multiple fantasy teams
 */
export async function loadMultipleRosters(
  rosters: FantraxRoster[],
  options: {
    clearExisting?: boolean;
  } = {}
): Promise<RosterLoadResult> {
  const result: RosterLoadResult = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    cleared: 0,
    failed: 0,
    errors: [],
  };

  for (const roster of rosters) {
    const rosterResult = await loadTeamRoster(roster, options);

    result.inserted += rosterResult.inserted;
    result.updated += rosterResult.updated;
    result.skipped += rosterResult.skipped;
    result.cleared += rosterResult.cleared;
    result.failed += rosterResult.failed;
    result.errors.push(...rosterResult.errors);
  }

  return result;
}
