# ETL Data Sources

This directory contains adapters for external data sources.

## Structure

- `nfl-api.ts` - NFL data source adapter
- `nba-api.ts` - NBA data source adapter
- `weather-api.ts` - Weather data adapter
- `news-api.ts` - News and injury reports adapter

## Example

```typescript
// lib/etl/sources/nfl-api.ts
export async function fetchNFLStats(week: number, season: number) {
  const response = await fetch(
    `https://api.example.com/nfl/stats/${season}/${week}`,
    {
      headers: { 'Authorization': `Bearer ${process.env.NFL_API_KEY}` }
    }
  );
  return response.json();
}
```

