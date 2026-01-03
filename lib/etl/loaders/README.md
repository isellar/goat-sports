# ETL Loaders

This directory contains database loading operations.

## Purpose

Handle inserting/updating data in the database with proper error handling and transactions.

## Example

```typescript
// lib/etl/loaders/stats.ts
import { db } from '@/lib/db';
import { playerStats } from '@/lib/db/schema';
import { NewPlayerStats } from '@/lib/db/schema';

export async function loadPlayerStats(stats: NewPlayerStats[]) {
  return await db.insert(playerStats)
    .values(stats)
    .onConflictDoUpdate({
      target: [playerStats.playerId, playerStats.gameId],
      set: {
        passingYards: sql`EXCLUDED.passing_yards`,
      }
    });
}
```

