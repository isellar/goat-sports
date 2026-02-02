/**
 * Player Database Loader
 * Handles upserting player data into the database
 */

import { db } from '@/lib/db';
import { players, teams } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import type { FantraxPlayer } from '../types/fantrax';
import {
  transformFantraxPlayerToSchema,
  mapNHLTeamNameToId,
  mapFantraxPositionToSchema,
} from '../transformers/players';

export interface PlayerLoadResult {
  inserted: number;
  updated: number;
  failed: number;
  errors: Array<{ player: string; error: string }>;
}

/**
 * Load players from Fantrax into the database
 * Uses upsert to handle both new players and updates
 */
export async function loadPlayers(
  fantraxPlayers: FantraxPlayer[]
): Promise<PlayerLoadResult> {
  if (!db) {
    throw new Error('Database not configured');
  }

  const result: PlayerLoadResult = {
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // First, ensure all NHL teams exist in the database
  const nhlTeamNames = new Set(
    fantraxPlayers
      .map(p => p.team_short_name)
      .filter(Boolean)
  );

  const nhlTeamIds = new Set<string>();
  for (const teamName of nhlTeamNames) {
    const teamId = mapNHLTeamNameToId(teamName);
    if (teamId) {
      nhlTeamIds.add(teamId);
    }
  }

  // Check which teams already exist
  const existingTeams = await db
    .select({ id: teams.id })
    .from(teams)
    .where(inArray(teams.id, Array.from(nhlTeamIds)));

  const existingTeamIds = new Set(existingTeams.map(t => t.id));

  // Create missing NHL teams (basic info only)
  const missingTeamIds = Array.from(nhlTeamIds).filter(
    id => !existingTeamIds.has(id)
  );

  if (missingTeamIds.length > 0) {
    const newTeams = missingTeamIds.map(id => ({
      id,
      name: id.toUpperCase(), // Placeholder name
      abbreviation: id.toUpperCase(),
      conference: 'Unknown' as const,
      division: 'Unknown' as const,
    }));

    await db.insert(teams).values(newTeams);
    console.log(`Created ${newTeams.length} NHL teams`);
  }

  // Batch process players
  const playerIds = fantraxPlayers.map(p => `fantrax_${p.id}`);

  // Get existing players in one query
  const existingPlayers = await db
    .select({ id: players.id })
    .from(players)
    .where(inArray(players.id, playerIds));

  const existingPlayerIds = new Set(existingPlayers.map(p => p.id));

  // Separate into inserts and updates
  const playersToInsert = [];
  const playersToUpdate = [];

  for (const fantraxPlayer of fantraxPlayers) {
    try {
      const playerData = transformFantraxPlayerToSchema(fantraxPlayer);
      const teamId = mapNHLTeamNameToId(fantraxPlayer.team_short_name);
      if (teamId) {
        playerData.teamId = teamId;
      }

      const playerId = `fantrax_${fantraxPlayer.id}`;

      if (existingPlayerIds.has(playerId)) {
        playersToUpdate.push({ id: playerId, ...playerData });
      } else {
        playersToInsert.push({ id: playerId, ...playerData });
      }
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        player: fantraxPlayer.short_name || fantraxPlayer.name,
        error: error.message,
      });
    }
  }

  // Batch insert new players
  if (playersToInsert.length > 0) {
    try {
      await db.insert(players).values(playersToInsert);
      result.inserted += playersToInsert.length;
    } catch (error: any) {
      result.errors.push({
        player: 'batch_insert',
        error: error.message,
      });
    }
  }

  // Batch update existing players (still need individual updates for now)
  for (const player of playersToUpdate) {
    try {
      const { id, ...data } = player;
      await db
        .update(players)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(players.id, id));
      result.updated++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        player: id,
        error: error.message,
      });
    }
  }

  return result;
}

/**
 * Batch upsert players for better performance
 * Note: Drizzle doesn't have native upsert yet, so we do it manually
 */
export async function batchLoadPlayers(
  fantraxPlayers: FantraxPlayer[],
  batchSize = 50
): Promise<PlayerLoadResult> {
  const result: PlayerLoadResult = {
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // Process in batches
  for (let i = 0; i < fantraxPlayers.length; i += batchSize) {
    const batch = fantraxPlayers.slice(i, i + batchSize);
    const batchResult = await loadPlayers(batch);

    result.inserted += batchResult.inserted;
    result.updated += batchResult.updated;
    result.failed += batchResult.failed;
    result.errors.push(...batchResult.errors);
  }

  return result;
}
