# Current Features

This document tracks the features currently implemented in GOAT Sports.

## Navigation

### Main Navigation
- **Header Navigation**: Sticky header with logo and navigation links
- **Pages**: Home, Players, Leagues
- **Theme Toggle**: Dark/light mode switcher
- **Active State**: 
  - Current page highlighted in navigation
  - Smart active detection: nested routes (e.g., `/leagues/[id]`) highlight parent route
  - Exact match for home page, prefix match for other pages
- **Responsive**: 
  - Desktop: Horizontal navigation menu
  - Mobile: Hamburger menu with slide-out sheet
  - Mobile menu closes on navigation

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

## League Management

### League Operations
- **Create League**: Set up new fantasy leagues with customizable settings
- **Join League**: Join existing leagues by league ID
- **League Settings**: Configure max teams, roster size, draft type
- **League Status**: Track league status (draft/active/completed)
- **Membership Tracking**: Track league members and their join dates

### League Pages
- `/leagues` - List all user's leagues with create/join options
- `/leagues/[id]` - League detail page with tabs:
  - Overview: League stats and commissioner info
  - Teams: List of fantasy teams in league
  - Members: List of league members
  - Settings: League configuration

### API Routes
- `GET /api/leagues` - List leagues (with optional userId filter)
- `POST /api/leagues` - Create new league
- `GET /api/leagues/[id]` - Get league details with members and teams
- `PATCH /api/leagues/[id]` - Update league settings
- `POST /api/leagues/[id]/join` - Join a league

## Roster Management

### Roster Operations
- **Add Players**: Search and add players to fantasy team rosters
- **Remove Players**: Drop players from rosters
- **Lineup Positions**: Assign players to positions:
  - C (Center)
  - LW (Left Wing)
  - RW (Right Wing)
  - D (Defenseman)
  - G (Goalie)
  - BN (Bench)
  - IR (Injured Reserve)
- **Position Management**: Change player lineup positions via dropdown
- **Roster View**: Organized by position with player cards

### Roster Page (`/leagues/[id]/teams/[teamId]/roster`)
- **Player Search**: Integrated player search dialog
- **Position Grouping**: Roster organized by lineup position
- **Quick Actions**: Add/remove players, update positions
- **Player Cards**: Reuses PlayerCard component for consistency
- **Access**: Available from league detail page teams tab

### API Routes
- `GET /api/fantasy-teams/[id]/roster` - Get team roster with player details
- `POST /api/fantasy-teams/[id]/roster` - Add player to roster
- `DELETE /api/fantasy-teams/[id]/roster/[playerId]` - Remove player from roster
- `PATCH /api/fantasy-teams/[id]/roster/[playerId]` - Update player lineup position
- `GET /api/fantasy-teams/[id]` - Get fantasy team details

## Draft System

### Draft Operations
- **Create Draft**: Set up draft for a league with draft order generation
- **Start Draft**: Begin draft session (changes status to in_progress)
- **Make Pick**: Select player during draft (automatically adds to roster)
- **Draft Order**: Snake draft order generation with round reversal
- **Turn Management**: Track current pick and whose turn it is
- **Auto-advance**: Automatically moves to next pick after selection

### Draft Room (`/leagues/[id]/draft`)
- **Live Updates**: Polls for draft updates every 5 seconds
- **Player Search**: Search and select players when it's your turn
- **Draft Board**: View all picks made so far
- **Draft Order**: Display full draft order with current pick highlighted
- **Turn Indicator**: Clear indication when it's your turn to pick
- **Status Tracking**: Draft status (scheduled/in_progress/completed/cancelled)

### Draft Utilities (`lib/utils/draft.ts`)
- `generateSnakeDraftOrder()` - Generate snake draft order with round reversal
- `shuffleDraftOrder()` - Randomize initial draft order
- `getTeamForPick()` - Get team ID for specific pick number
- `calculateTotalPicks()` - Calculate total picks needed
- `getRoundNumber()` - Get round number from pick number
- `isLastPickOfRound()` - Check if pick is last in round

### API Routes
- `GET /api/leagues/[id]/draft` - Get draft for league
- `POST /api/leagues/[id]/draft` - Create draft for league
- `GET /api/drafts/[id]` - Get draft details with picks
- `PATCH /api/drafts/[id]` - Update draft (status, current pick, etc.)
- `POST /api/drafts/[id]/pick` - Make a draft pick

### Testing
- **Unit Tests**: Comprehensive test coverage for draft utilities and API routes
- **Test Files**: 
  - `lib/utils/draft.test.ts` - 19 tests (draft utilities)
  - `app/api/leagues/[id]/draft/route.test.ts` - 5 tests
  - `app/api/drafts/[id]/route.test.ts` - 4 tests
  - `app/api/drafts/[id]/pick/route.test.ts` - 5 tests
- **Test Coverage**: All draft operations tested (create, start, pick, update)
- **Mock Data**: Test fixtures for drafts and draft picks

## Technical Implementation

### Database
- PostgreSQL via Supabase
- Drizzle ORM for type-safe queries
- Lazy initialization for development flexibility
- Roster table with lineup position tracking

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



