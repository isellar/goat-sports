# Current Features

This document tracks the features currently implemented in GOAT Sports.

## Player Management

### Player Database
- **Schema**: Comprehensive NHL player database with:
  - Basic info: name, position, team, jersey number, date of birth, status
  - **Skater Stats**: G, A, P, PIM, SOG, PPP, SHP, Hits, Blocks, Takeaways
  - **Goalie Stats**: W, OW, OL+SHL, GA, SV, SHO, ShW, G, A
  - **Analytics**: Position Rank, Position Rank Last 10, Heat Score, Trend Score
  - **Calculated**: Fantasy Points, Fantasy Points per Game, Games Played (estimated)

### Player List Page (`/players`)
- **Search & Filtering**:
  - Search by player name
  - Filter by position (C, LW, RW, D, G)
  - Filter by team
  - Filter by minimum points/goals
  - Sort by multiple fields (name, position, team, stats, fantasy points)
- **Player Card Component**:
  - Consolidates: Name (#jersey), Position, Team, Age, Status
  - Status gradient (DTD/IR/Minors) with color-coded badge
  - Compact, space-efficient design
- **Table Columns**:
  - Player (card)
  - Opp (Next Opponent with slate highlighting)
  - GP (Games Played)
  - FPts (Fantasy Points)
  - FP/G (Fantasy Points per Game)
  - Pos Rank (Position Rank)
  - Pos Rank L10 (Position Rank Last 10)
  - Heat (🔥/❄️ indicator, -3 to 3)
  - Trend (trending up/down with score)
  - Expand button (chevron)
- **Stats Modal**:
  - Expandable modal showing detailed position-specific stats
  - Different stats for skaters vs goalies
  - Accessible via expand button on each row

### Next Opponent Tracking
- Shows next scheduled game for each player's team
- Displays opponent abbreviation and game time
- Highlights games in "next slate" (today/tomorrow) in blue/bold
- Uses `games` table to track schedule

## Database

### Schema (`lib/db/schema.ts`)
- **Teams**: NHL teams with abbreviation, conference, division
- **Players**: Comprehensive player data (see Player Database above)
- **Games**: Scheduled games with home/away teams, dates, scores
- **Users**: User accounts (for future auth)

### Migrations
- Drizzle Kit for schema versioning
- Migration files in `drizzle/` directory
- Manual migration scripts for complex changes

### Seeding
- Seed script (`scripts/seed.ts`) with sample NHL data
- 32 NHL teams
- 14 sample players with full stats
- 7 sample games for next opponent testing

## UI Components

### Player Components
- `PlayerCard`: Compact player info card with status gradient
- `PlayerTableRow`: Table row with all player data
- `PlayerStatsModal`: Expandable modal for detailed stats
- `HeatScore`: Visual heat indicator (🔥/❄️)
- `TrendScore`: Trending indicator with score
- `SortableTableHead`: Reusable sortable table header

### Utilities
- `lib/utils/fantasy.ts`: Fantasy points calculations
- `lib/utils/player.ts`: Player utilities (age, game date formatting, slate detection)

## API Routes

### `/api/players`
- GET endpoint with query parameters:
  - `search`: Player name search
  - `position`: Filter by position
  - `teamId`: Filter by team
  - `minPoints`, `minGoals`: Stat filters
  - `sortBy`, `sortOrder`: Sorting
  - `limit`, `offset`: Pagination
- Returns players with team info and next game data

### `/api/teams`
- GET endpoint returning all NHL teams

## Status System

### Player Status
- **DTD** (Day-to-Day): Yellow indicator
- **IR** (Injured Reserve): Red indicator
- **Minors**: Yellow indicator
- **Healthy**: No status badge (clean display)

### Status Display
- Small text badge on player card
- Color-coded gradient on card background
- Hockey-specific status terminology

## Heat & Trend Scores

### Heat Score
- Range: -3 to 3
- **Positive**: 🔥🔥🔥 (hot players)
- **Negative**: ❄️❄️❄️ (cold players)
- Indicates recent performance streak

### Trend Score
- Integer value (can be positive or negative)
- **Positive**: Trending up icon with +score
- **Negative**: Trending down icon with score
- Indicates how much more frequently players are being added

## Technical Implementation

### Database
- PostgreSQL via Supabase
- Drizzle ORM for type-safe queries
- Lazy initialization for development flexibility

### Frontend
- Next.js 15 App Router
- React 19
- TypeScript throughout
- Tailwind CSS + shadcn/ui components
- Client components for interactive features

### Type Safety
- Full TypeScript inference from Drizzle schema
- Shared types exported from schema
- Type-safe API routes and components

