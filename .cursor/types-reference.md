# Type Reference Guide

Quick reference for common types used in GOAT Sports.

## Database Types

All database types are inferred from `lib/db/schema.ts`. Import them like this:

```typescript
import type { Player, Team, Game, User } from '@/lib/db/schema';
```

### Player Type
```typescript
type Player = {
  id: string;
  name: string;
  position: 'C' | 'LW' | 'RW' | 'D' | 'G';
  teamId: string | null;
  jerseyNumber: number | null;
  dateOfBirth: Date | null;
  // Skater stats
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  // ... more fields
  // Goalie stats
  wins: number;
  losses: number;
  shutouts: number;
  // ... more fields
  status: 'healthy' | 'questionable' | 'injured' | 'out';
  heatScore: number; // -3 to 3
  trendScore: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Team Type
```typescript
type Team = {
  id: string;
  name: string;
  abbreviation: string;
  conference: string | null; // 'Eastern' | 'Western'
  division: string | null; // 'Atlantic' | 'Metropolitan' | 'Central' | 'Pacific'
  createdAt: Date;
}
```

### Game Type
```typescript
type Game = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  gameDate: Date;
  status: 'scheduled' | 'in_progress' | 'final';
  homeScore: number | null;
  awayScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Extended Types

### Player with Relations
```typescript
interface PlayerWithTeam extends Player {
  team: Team | null;
}

interface PlayerWithTeamAndNextGame extends Player {
  team: Team | null;
  nextGame: (Game & { 
    homeTeam: Team; 
    awayTeam: Team 
  }) | null;
}
```

## API Response Types

### Success Response
```typescript
interface ApiSuccessResponse<T> {
  data?: T;
  players?: T[]; // For player endpoints
  teams?: T[]; // For team endpoints
  total?: number;
  limit?: number;
  offset?: number;
}
```

### Error Response
```typescript
interface ApiErrorResponse {
  error: string;
}
```

## Component Prop Types

### Common Patterns
```typescript
// With player data
interface PlayerComponentProps {
  player: Player | PlayerWithTeam;
  showStats?: boolean;
  onSelect?: (player: Player) => void;
}

// With team data
interface TeamComponentProps {
  team: Team;
  showPlayers?: boolean;
}

// With game data
interface GameComponentProps {
  game: Game & {
    homeTeam: Team;
    awayTeam: Team;
  };
}
```

## Utility Function Types

### Fantasy Points
```typescript
function calculateFantasyPoints(player: Player): number;
function calculateSkaterFantasyPoints(player: Player): number;
function calculateGoalieFantasyPoints(player: Player): number;
function calculateFantasyPointsPerGame(
  player: Player,
  gamesPlayed?: number
): number;
```

### Player Utilities
```typescript
function calculateAge(dateOfBirth: Date | string | null | undefined): number | null;
function isInNextSlate(gameDate: Date | string | null | undefined): boolean;
function formatGameDateTime(gameDate: Date | string | null | undefined): string;
```

## Drizzle Query Types

### Select Result Types
```typescript
// Single table query
const result = await db.select().from(players);
// result: Player[]

// Join query
const result = await db
  .select({
    player: players,
    team: teams,
  })
  .from(players)
  .leftJoin(teams, eq(players.teamId, teams.id));
// result: { player: Player; team: Team | null }[]
```

## React Component Types

### Server Component (default)
```typescript
// No 'use client' directive
export default function Component() {
  // Can use async/await
  // Can directly access database
}
```

### Client Component
```typescript
'use client';

import { useState, useEffect } from 'react';

export function Component() {
  // Can use hooks
  // Can use browser APIs
  // Cannot directly access database (use API routes)
}
```

## Form Types

### React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;
```

## Common Type Patterns

### Optional with Default
```typescript
interface Props {
  required: string;
  optional?: boolean; // Can be undefined
  withDefault?: boolean; // Use default in destructuring
}

function Component({ required, optional, withDefault = false }: Props) {
  // withDefault is always boolean, never undefined
}
```

### Nullable Types
```typescript
// Database fields can be null
teamId: string | null;

// Always check before use
if (player.teamId) {
  // teamId is string here (type narrowing)
}
```

### Union Types
```typescript
// Position enum
type Position = 'C' | 'LW' | 'RW' | 'D' | 'G';

// Status enum
type PlayerStatus = 'healthy' | 'questionable' | 'injured' | 'out';

// Game status enum
type GameStatus = 'scheduled' | 'in_progress' | 'final';
```

## Type Guards

```typescript
// Check if player is goalie
function isGoalie(player: Player): player is Player & { position: 'G' } {
  return player.position === 'G';
}

// Usage
if (isGoalie(player)) {
  // TypeScript knows position is 'G' here
  const points = calculateGoalieFantasyPoints(player);
}
```

