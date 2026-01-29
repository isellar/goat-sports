#!/usr/bin/env bun
/**
 * Inspect all available fields in Fantrax API responses
 */

import { readFileSync } from 'fs';

function inspectFields() {
  console.log('🔍 Inspecting Fantrax API Fields\n');

  // Inspect teams
  try {
    const teamsData = JSON.parse(readFileSync('debug-teams-response.json', 'utf-8'));
    console.log('📋 TEAMS - Available fields on first team:');
    if (teamsData.fantasyTeams?.[0]) {
      const team = teamsData.fantasyTeams[0];
      console.log('Fields:', Object.keys(team).join(', '));
      console.log('\nSample team object:');
      console.log(JSON.stringify(team, null, 2));
    }
  } catch (error) {
    console.log('⚠️  Could not read debug-teams-response.json');
  }

  // Inspect roster
  try {
    const rosterData = JSON.parse(readFileSync('debug-roster-response.json', 'utf-8'));
    console.log('\n\n📋 ROSTER - Available fields on first row with player:');
    const firstTable = rosterData.tables?.[0];
    const firstRow = firstTable?.rows?.find((r: any) => r.scorer);
    if (firstRow) {
      console.log('Row fields:', Object.keys(firstRow).join(', '));
      console.log('\nLooking for scoring/stats fields...');

      // Check for any fields that might contain FPPG or stats
      const scoringFields = Object.keys(firstRow).filter(k =>
        k.toLowerCase().includes('fppg') ||
        k.toLowerCase().includes('score') ||
        k.toLowerCase().includes('point') ||
        k.toLowerCase().includes('stat')
      );
      console.log('Potential scoring fields:', scoringFields);

      // Check cells array if it exists
      if (firstRow.cells) {
        console.log('\n📊 Row has "cells" array with', firstRow.cells.length, 'items');
        console.log('First 5 cells:');
        firstRow.cells.slice(0, 5).forEach((cell: any, i: number) => {
          console.log(`  Cell ${i}:`, JSON.stringify(cell, null, 2));
        });
      }

      // Show full row for one player
      console.log('\n\n📄 Complete first player row:');
      console.log(JSON.stringify(firstRow, null, 2));
    }
  } catch (error) {
    console.log('⚠️  Could not read debug-roster-response.json');
  }

  console.log('\n\n✅ Done! Check the output above to find:');
  console.log('  1. Owner field in team object');
  console.log('  2. FPPG/scoring data location (might be in cells array)');
  console.log('  3. Any additional position details');
}

inspectFields();
