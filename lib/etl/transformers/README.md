# ETL Transformers

This directory contains data transformation logic.

## Purpose

Transform raw data from sources into the format expected by the database.

## Example

```typescript
// lib/etl/transformers/stats.ts
import { NewPlayerStats } from '@/lib/db/schema';
import { RawNFLStats } from '@/lib/etl/sources/nfl-api';

export function transformNFLStats(rawStats: RawNFLStats[]): NewPlayerStats[] {
  return rawStats.map(stat => ({
    playerId: stat.PlayerID,
    gameId: stat.GameID,
    passingYards: stat.PassingYards || 0,
    // ... other transformations
  }));
}
```

