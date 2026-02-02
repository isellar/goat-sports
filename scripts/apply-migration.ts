#!/usr/bin/env bun
/**
 * Manually apply pending migration
 */

import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

console.log('📋 Applying migration: 0001_cold_wither\n');

try {
  if (!db) {
    console.error('❌ Database not configured');
    process.exit(1);
  }

  // Execute migration SQL
  console.log('1. Making owner_id nullable...');
  await db.execute(sql`ALTER TABLE "fantasy_teams" ALTER COLUMN "owner_id" DROP NOT NULL`);
  console.log('   ✅ Done');

  console.log('\n2. Adding abbreviation column...');
  await db.execute(sql`ALTER TABLE "fantasy_teams" ADD COLUMN "abbreviation" text`);
  console.log('   ✅ Done');

  console.log('\n✅ Migration applied successfully!\n');
  console.log('You can now:');
  console.log('  • Join the e2e-test-league');
  console.log('  • Run: bun run e2e:etl');

} catch (error: any) {
  console.error('\n❌ Migration failed:', error.message);

  if (error.message.includes('already exists')) {
    console.log('\n💡 This migration may have already been applied.');
  }

  process.exit(1);
}
