# GOAT Sports NHL Fantasy Hockey - MVP Implementation Plan

## Executive Summary

GOAT Sports has a solid foundation (70-80% complete) with database schema, league management, draft system, and roster management already built. Four critical gaps prevent MVP release:

1. **Authentication: 0%** - No login system (Supabase configured but unused)
2. **Data Population: 0%** - Empty database (ETL architecture designed but not implemented)
3. **Matchups/Scoring: 20%** - Fantasy points calculation exists but no weekly matchup system
4. **Dynasty/Keeper: 0%** - Nice-to-have feature (can defer if needed)

**Target**: Production-ready NHL fantasy hockey app with real stats, authentication, and weekly head-to-head gameplay.

**Deployment**: Vercel Free + Supabase Free tier (10s API timeout constraint)

**Timeline**: Flexible (quality over speed), estimated 8-10 weeks for full MVP

---

## Phase 1: Authentication & Security (Week 1-2)

**Priority: CRITICAL** - Must complete first. All API routes currently public with hard-coded `user_test_1`.

### Schema Changes

```typescript
// lib/db/schema.ts - Add profile linking table
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').unique().notNull(), // Links to Supabase auth.users.id
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Critical Files to Create

**Auth Utilities:**
- `lib/auth/server.ts` - Server-side helpers: `getUser()`, `requireAuth()`, `getSession()`
- `lib/auth/client.ts` - Client hooks: `useUser()`, `useSession()`

**Middleware:**
- `middleware.ts` (root) - Protect routes, redirect unauthenticated users

**Auth Pages:**
- `app/auth/login/page.tsx` - Email/password login + Google OAuth
- `app/auth/signup/page.tsx` - User registration
- `app/auth/callback/route.ts` - OAuth callback handler
- `app/auth/error/page.tsx` - Auth error display

**Components:**
- `components/auth/AuthProvider.tsx` - Client-side auth context wrapper
- `components/auth/LoginForm.tsx` - Email/password form
- `components/auth/SignupForm.tsx` - Registration form
- `components/auth/UserMenu.tsx` - User dropdown in navigation

### API Route Updates

**Add to ALL existing API routes:**
```typescript
import { requireAuth } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... existing logic, replace user_test_1 with user.id
}
```

**Routes requiring updates:**
- `app/api/leagues/route.ts` (GET, POST)
- `app/api/leagues/[id]/route.ts` (GET, PATCH)
- `app/api/leagues/[id]/join/route.ts` (POST)
- `app/api/leagues/[id]/draft/route.ts` (POST)
- `app/api/drafts/[id]/route.ts` (GET, PATCH)
- `app/api/drafts/[id]/pick/route.ts` (POST)
- `app/api/fantasy-teams/[id]/roster/route.ts` (GET, POST)
- `app/api/fantasy-teams/[id]/roster/[playerId]/route.ts` (PATCH, DELETE)

### Implementation Steps

1. **Set up Supabase Auth** (1 day)
   - Enable email/password auth in Supabase dashboard
   - Configure Google OAuth provider
   - Set up email templates (welcome, password reset)

2. **Create auth utilities** (1 day)
   - Implement `lib/auth/server.ts` with session validation
   - Create `lib/auth/client.ts` with React hooks
   - Add `middleware.ts` for route protection

3. **Build auth UI** (2 days)
   - Login page with email/password + Google button
   - Signup page with validation
   - Update navigation with user menu
   - Add AuthProvider to app layout

4. **Migrate API routes** (2 days)
   - Add `requireAuth()` to all endpoints
   - Replace `user_test_1` with authenticated user ID
   - Add commissioner checks (userId === league.commissionerId)
   - Test protected routes return 401

5. **Create profiles table** (1 day)
   - Generate migration: `bun run db:generate`
   - Apply migration: `bun run db:migrate`
   - Add trigger to create profile on user signup

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=<existing>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<existing>
SUPABASE_SERVICE_ROLE_KEY=<add_from_supabase_dashboard>
```

### Verification

- [ ] User can sign up with email/password
- [ ] User can log in with Google OAuth
- [ ] Unauthenticated requests to `/api/leagues` return 401
- [ ] User can create league (user.id set as commissionerId)
- [ ] User can only see their own leagues
- [ ] Navigation shows logged-in user's name/avatar
- [ ] Logout works and clears session

---

## Phase 2: Data Population with Fantrax (Week 3-4)

**Priority: CRITICAL** - Real NHL stats needed for gameplay.

### Schema Changes

```typescript
// lib/db/schema.ts additions

// Track sync jobs
export const dataSyncJobs = pgTable('data_sync_jobs', {
  id: text('id').primaryKey(),
  jobType: text('job_type').notNull(), // 'players', 'games', 'daily_stats'
  status: text('status').notNull(), // 'running', 'success', 'error'
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  recordsProcessed: integer('records_processed').default(0),
  errorMessage: text('error_message'),
});

// Update players table
export const players = pgTable('players', {
  // ... existing fields ...
  fantraxId: text('fantrax_id').unique(), // Map to Fantrax player ID
  gamesPlayed: integer('games_played').default(0),
});

// Update games table
export const games = pgTable('games', {
  // ... existing fields ...
  externalId: text('external_id').unique(), // Fantrax/NHL API game ID
});
```

### Critical Files to Create

**Fantrax API Client:**
- `lib/etl/sources/fantrax/client.ts` - HTTP client with auth
- `lib/etl/sources/fantrax/players.ts` - Fetch player roster
- `lib/etl/sources/fantrax/games.ts` - Fetch game schedule
- `lib/etl/sources/fantrax/stats.ts` - Fetch daily stat updates

**Transformers:**
- `lib/etl/transformers/nhl/players.ts` - Map Fantrax player data to schema
- `lib/etl/transformers/nhl/games.ts` - Map game schedule to schema
- `lib/etl/transformers/nhl/stats.ts` - Map stat updates to schema

**Loaders:**
- `lib/etl/loaders/players.ts` - Upsert players with `onConflictDoUpdate`
- `lib/etl/loaders/games.ts` - Upsert games
- `lib/etl/loaders/stats.ts` - Update player season stats

**Orchestration Jobs:**
- `lib/etl/jobs/sync-players.ts` - Full player roster sync (run once)
- `lib/etl/jobs/sync-schedule.ts` - Full season schedule sync (run weekly)
- `lib/etl/jobs/sync-daily-stats.ts` - Daily stat updates (run daily)

**API Endpoints:**
- `app/api/admin/etl/sync-players/route.ts` - Manual player sync trigger
- `app/api/admin/etl/sync-schedule/route.ts` - Manual schedule sync
- `app/api/admin/etl/sync-stats/route.ts` - Manual stats sync
- `app/api/admin/etl/status/route.ts` - View sync job history
- `app/api/cron/daily-stats/route.ts` - Vercel Cron endpoint (daily)

### Fantrax Integration Details

**Field Mapping (Example):**
```typescript
// Fantrax → Schema mapping
{
  id: fantraxPlayer.id,
  fantraxId: fantraxPlayer.id,
  name: fantraxPlayer.name,
  position: mapPosition(fantraxPlayer.position), // 'C', 'LW', 'RW', 'D', 'G'
  teamId: lookupTeamId(fantraxPlayer.team),
  goals: fantraxPlayer.stats.goals || 0,
  assists: fantraxPlayer.stats.assists || 0,
  // ... map all stat fields
}
```

**Rate Limiting Strategy:**
- Respect Fantrax API rate limits (check docs)
- Implement exponential backoff on 429 responses
- Batch requests where possible
- Cache responses for development

### Implementation Steps

1. **Fantrax API research** (1 day)
   - Review Fantrax API documentation
   - Identify endpoints for players, games, stats
   - Test API credentials
   - Document field mappings

2. **Build Fantrax client** (2 days)
   - Create HTTP client with authentication
   - Implement fetch methods for players, games, stats
   - Add retry logic and error handling
   - Write unit tests for client

3. **Create transformers** (2 days)
   - Map Fantrax fields to database schema
   - Handle missing/null data gracefully
   - Validate transformed data with Zod schemas
   - Write unit tests for transformations

4. **Build loaders** (1 day)
   - Implement upsert logic with conflict resolution
   - Batch inserts for performance
   - Transaction handling for atomicity
   - Log records processed

5. **Create orchestration jobs** (2 days)
   - Sync players: Fetch all → Transform → Load
   - Sync schedule: Fetch games → Transform → Load
   - Sync daily stats: Fetch updates → Transform → Update
   - Add job status tracking to database

6. **Set up Vercel Cron** (1 day)
   - Create `vercel.json` with cron schedules
   - Implement `/api/cron/daily-stats` endpoint
   - Test cron locally with Vercel CLI
   - Deploy and verify cron execution

### Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-stats",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### Environment Variables

```env
FANTRAX_API_KEY=<obtain_from_fantrax>
FANTRAX_BASE_URL=https://api.fantrax.com
FANTRAX_LEAGUE_ID=<optional_if_needed>
```

### Verification

- [ ] Run player sync: 50+ NHL players in database
- [ ] Run schedule sync: Full NHL season schedule loaded
- [ ] Run daily stats sync: Player stats updated correctly
- [ ] Verify stats match Fantrax (manual spot check)
- [ ] Cron job executes daily at 6 AM UTC
- [ ] Sync job status tracked in `dataSyncJobs` table
- [ ] Player table displays real stats in UI

---

## Phase 3: Matchups & Weekly Scoring (Week 5-7)

**Priority: HIGH** - Core fantasy gameplay feature.

### Schema Changes

```typescript
// lib/db/schema.ts additions

export const matchupStatusEnum = pgEnum('matchup_status', ['scheduled', 'in_progress', 'final']);

export const matchups = pgTable('matchups', {
  id: text('id').primaryKey(),
  leagueId: text('league_id').references(() => leagues.id).notNull(),
  weekNumber: integer('week_number').notNull(),
  team1Id: text('team1_id').references(() => fantasyTeams.id).notNull(),
  team2Id: text('team2_id').references(() => fantasyTeams.id),
  team1Score: integer('team1_score').default(0),
  team2Score: integer('team2_score').default(0),
  winnerId: text('winner_id').references(() => fantasyTeams.id),
  status: matchupStatusEnum('status').default('scheduled'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const weeklyScores = pgTable('weekly_scores', {
  id: text('id').primaryKey(),
  matchupId: text('matchup_id').references(() => matchups.id).notNull(),
  fantasyTeamId: text('fantasy_team_id').references(() => fantasyTeams.id).notNull(),
  playerId: text('player_id').references(() => players.id).notNull(),
  weekNumber: integer('week_number').notNull(),
  gamesPlayed: integer('games_played').default(0),
  // Skater stats
  goals: integer('goals').default(0),
  assists: integer('assists').default(0),
  plusMinus: integer('plus_minus').default(0),
  // Goalie stats
  wins: integer('wins').default(0),
  losses: integer('losses').default(0),
  shutouts: integer('shutouts').default(0),
  // Calculated
  fantasyPoints: integer('fantasy_points').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const standings = pgTable('standings', {
  id: text('id').primaryKey(),
  leagueId: text('league_id').references(() => leagues.id).notNull(),
  fantasyTeamId: text('fantasy_team_id').references(() => fantasyTeams.id).notNull(),
  wins: integer('wins').default(0),
  losses: integer('losses').default(0),
  ties: integer('ties').default(0),
  pointsFor: integer('points_for').default(0),
  pointsAgainst: integer('points_against').default(0),
  rank: integer('rank'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Update leagues table
export const leagues = pgTable('leagues', {
  // ... existing fields ...
  seasonStartDate: timestamp('season_start_date'),
  seasonEndDate: timestamp('season_end_date'),
  currentWeek: integer('current_week').default(1),
  matchupDuration: integer('matchup_duration').default(7), // Days per matchup
});
```

### Critical Files to Create

**Utilities:**
- `lib/utils/matchups.ts` - Matchup generation, score calculation
- `lib/utils/standings.ts` - Standings calculation and ranking
- `lib/utils/schedule.ts` - Week/date utilities

**API Endpoints:**
- `app/api/leagues/[id]/matchups/generate/route.ts` - Generate season matchups
- `app/api/leagues/[id]/matchups/route.ts` - Get all matchups
- `app/api/leagues/[id]/matchups/week/[week]/route.ts` - Get week matchups
- `app/api/leagues/[id]/standings/route.ts` - Get standings
- `app/api/matchups/[id]/route.ts` - Get single matchup details
- `app/api/cron/calculate-scores/route.ts` - Weekly scoring cron

**UI Pages:**
- `app/leagues/[id]/matchups/page.tsx` - All matchups grid view
- `app/leagues/[id]/matchups/week/[week]/page.tsx` - Single week detail
- `app/leagues/[id]/standings/page.tsx` - League standings table
- `app/leagues/[id]/schedule/page.tsx` - Season calendar view

**Components:**
- `components/matchups/MatchupCard.tsx` - Team vs team score display
- `components/matchups/ScoreBreakdown.tsx` - Player-by-player points
- `components/matchups/WeekSelector.tsx` - Navigate between weeks
- `components/standings/StandingsTable.tsx` - Sortable standings
- `components/standings/TeamStats.tsx` - Record, PF, PA display

### Scoring Algorithm

```typescript
// lib/utils/matchups.ts

/**
 * Calculate weekly scores for a matchup
 * 1. Find all active roster players (not bench/IR) for both teams
 * 2. For each player, sum fantasy points from games during matchup week
 * 3. Aggregate to team totals
 * 4. Determine winner
 * 5. Update standings
 */
export async function calculateMatchupScores(matchupId: string) {
  const matchup = await db.select()...;
  const team1Roster = await getActiveRoster(matchup.team1Id, matchup.weekNumber);
  const team2Roster = await getActiveRoster(matchup.team2Id, matchup.weekNumber);

  // Calculate weekly stats for each player from games played during matchup dates
  const team1Score = await calculateTeamScore(team1Roster, matchup.startDate, matchup.endDate);
  const team2Score = await calculateTeamScore(team2Roster, matchup.startDate, matchup.endDate);

  // Update matchup
  await updateMatchup(matchupId, team1Score, team2Score);

  // Update standings
  await updateStandings(matchup.leagueId);
}
```

### Matchup Generation Strategy

**Round-Robin Schedule:**
- For N teams, generate (N-1) weeks if even, N weeks if odd
- Each team plays each other team once (or twice for longer seasons)
- Handle bye weeks for odd-numbered leagues

**Weekly Matchup Pairing:**
```typescript
// Example for 6 teams over 5 weeks
Week 1: 1v2, 3v4, 5v6
Week 2: 1v3, 2v5, 4v6
Week 3: 1v4, 2v6, 3v5
Week 4: 1v5, 2v4, 3v6
Week 5: 1v6, 2v3, 4v5
```

### Implementation Steps

1. **Create matchup utilities** (2 days)
   - Implement round-robin algorithm
   - Calculate week start/end dates
   - Generate full season schedule
   - Write unit tests

2. **Build scoring calculator** (3 days)
   - Query active roster players
   - Aggregate stats from games during matchup week
   - Calculate fantasy points using existing `lib/utils/fantasy.ts`
   - Store weekly scores
   - Update matchup totals

3. **Implement standings** (1 day)
   - Calculate W-L-T records
   - Calculate points for/against
   - Rank teams (wins, then PF)
   - Update standings table

4. **Build API endpoints** (2 days)
   - Matchup generation endpoint (run once per league)
   - Matchup retrieval endpoints
   - Standings endpoint
   - Score calculation endpoint

5. **Create UI pages** (3 days)
   - Matchups page with week selector
   - Matchup detail with score breakdown
   - Standings table with sorting
   - Season schedule calendar

6. **Set up scoring cron** (1 day)
   - Weekly cron to calculate scores (Monday 2 AM)
   - Update matchup status (scheduled → in_progress → final)
   - Recalculate standings

### Vercel Cron Addition

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-stats",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/calculate-scores",
      "schedule": "0 2 * * 1"
    }
  ]
}
```

### Verification

- [ ] Generate matchups for 6-team league (5 weeks created)
- [ ] Generate matchups for 7-team league (7 weeks with bye)
- [ ] Calculate scores for week 1 (verify points match)
- [ ] Standings update correctly after week 1
- [ ] Matchup UI displays teams and scores
- [ ] Score breakdown shows player contributions
- [ ] Cron job runs weekly and updates scores
- [ ] Navigate between weeks in UI

---

## Phase 4: Waiver Wire & Trades (Week 8-9)

**Priority: MEDIUM-HIGH** - Essential for in-season roster management.

### Schema Changes

```typescript
// lib/db/schema.ts additions

export const waiverStatusEnum = pgEnum('waiver_status', ['pending', 'approved', 'rejected', 'cancelled']);
export const tradeStatusEnum = pgEnum('trade_status', ['proposed', 'accepted', 'rejected', 'cancelled']);

export const waiverClaims = pgTable('waiver_claims', {
  id: text('id').primaryKey(),
  leagueId: text('league_id').references(() => leagues.id).notNull(),
  fantasyTeamId: text('fantasy_team_id').references(() => fantasyTeams.id).notNull(),
  addPlayerId: text('add_player_id').references(() => players.id).notNull(),
  dropPlayerId: text('drop_player_id').references(() => players.id),
  status: waiverStatusEnum('status').default('pending'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const trades = pgTable('trades', {
  id: text('id').primaryKey(),
  leagueId: text('league_id').references(() => leagues.id).notNull(),
  proposingTeamId: text('proposing_team_id').references(() => fantasyTeams.id).notNull(),
  receivingTeamId: text('receiving_team_id').references(() => fantasyTeams.id).notNull(),
  status: tradeStatusEnum('status').default('proposed'),
  proposedAt: timestamp('proposed_at').defaultNow(),
  respondedAt: timestamp('responded_at'),
  expiresAt: timestamp('expires_at'),
});

export const tradeItems = pgTable('trade_items', {
  id: text('id').primaryKey(),
  tradeId: text('trade_id').references(() => trades.id).notNull(),
  fromTeamId: text('from_team_id').references(() => fantasyTeams.id).notNull(),
  toTeamId: text('to_team_id').references(() => fantasyTeams.id).notNull(),
  playerId: text('player_id').references(() => players.id).notNull(),
});

// Update leagues table
export const leagues = pgTable('leagues', {
  // ... existing fields ...
  waiverType: text('waiver_type').default('fcfs'), // 'fcfs' only for MVP
  tradeDeadline: timestamp('trade_deadline'),
});
```

### Critical Files to Create

**API Endpoints:**
- `app/api/leagues/[id]/waivers/route.ts` - Submit waiver claim (POST), get waivers (GET)
- `app/api/waivers/[id]/route.ts` - Cancel waiver (DELETE)
- `app/api/leagues/[id]/trades/route.ts` - Propose trade (POST), get trades (GET)
- `app/api/trades/[id]/accept/route.ts` - Accept trade (POST)
- `app/api/trades/[id]/reject/route.ts` - Reject trade (POST)

**UI Pages:**
- `app/leagues/[id]/waivers/page.tsx` - Waiver wire (add/drop interface)
- `app/leagues/[id]/trades/page.tsx` - Trade center (view all trades)
- `app/leagues/[id]/trades/new/page.tsx` - Propose new trade

**Components:**
- `components/waivers/WaiverForm.tsx` - Add/drop player form
- `components/waivers/WaiverList.tsx` - Pending waivers display
- `components/trades/TradeProposal.tsx` - Trade builder interface
- `components/trades/TradeCard.tsx` - Trade display with accept/reject

### Waiver Wire Logic (FCFS for MVP)

**First-Come-First-Served:**
- User submits add/drop request
- Process immediately (no waiver period)
- Validate: player available, roster size limits
- Execute: remove dropped player, add new player
- Update rosters table

### Trade Logic

**Proposal:**
- User selects players from both teams
- Create trade record with status='proposed'
- Create tradeItems for each player
- Send notification to receiving team

**Response:**
- Receiving team accepts or rejects
- If accepted: execute trade (swap rosters)
- If rejected: mark trade as rejected
- Auto-expire after 48 hours

### Implementation Steps

1. **Build waiver system** (2 days)
   - Create waiver claim endpoint
   - Validate roster limits
   - Instant processing (FCFS)
   - Update rosters atomically
   - Build waiver UI

2. **Build trade system** (3 days)
   - Trade proposal endpoint
   - Trade response endpoints (accept/reject)
   - Execute trade logic (swap players)
   - Build trade proposal UI
   - Build trade review UI

3. **Add to navigation** (1 day)
   - Add "Waivers" and "Trades" to league tabs
   - Show pending trade count badge

### Verification

- [ ] User can add player via waivers (drops player, adds new)
- [ ] Roster size limits enforced
- [ ] Cannot add already-rostered player
- [ ] User can propose trade (select multiple players)
- [ ] Receiving team can accept trade (players swap)
- [ ] Receiving team can reject trade
- [ ] Trades auto-expire after 48 hours
- [ ] Waiver UI shows available players
- [ ] Trade UI shows pending trades

---

## Phase 5: Dynasty/Keeper & Team Customization (Week 10) - OPTIONAL

**Priority: NICE-TO-HAVE** - Can defer to v1.1 if time constrained.

### Schema Changes

```typescript
// lib/db/schema.ts additions

export const rosters = pgTable('rosters', {
  // ... existing fields ...
  isKeeper: boolean('is_keeper').default(false),
  keeperYear: integer('keeper_year'), // Year designated as keeper
});

export const fantasyTeams = pgTable('fantasy_teams', {
  // ... existing fields ...
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').default('#1f2937'),
});

export const leagues = pgTable('leagues', {
  // ... existing fields ...
  isDynasty: boolean('is_dynasty').default(false),
  keeperCount: integer('keeper_count').default(0),
  keeperDeadline: timestamp('keeper_deadline'),
});
```

### Critical Files to Create

**API Endpoints:**
- `app/api/fantasy-teams/[id]/settings/route.ts` - Update team name, colors, logo
- `app/api/fantasy-teams/[id]/keepers/route.ts` - Get/set keepers

**UI Pages:**
- `app/leagues/[id]/teams/[teamId]/settings/page.tsx` - Team customization
- `app/leagues/[id]/teams/[teamId]/keepers/page.tsx` - Keeper management

**Components:**
- `components/teams/TeamCustomization.tsx` - Team name/color editor
- `components/roster/KeeperToggle.tsx` - Designate keeper checkbox

### Implementation Steps

1. **Team customization** (2 days)
   - Update team name endpoint
   - Color picker UI
   - Optional: logo upload (defer if complex)

2. **Keeper system** (3 days)
   - Keeper designation endpoint
   - Validate keeper limits
   - Reserve draft slots for keepers
   - Keeper management UI

### Verification

- [ ] User can change team name
- [ ] User can pick team colors
- [ ] Dynasty league allows keeper designation
- [ ] Keeper count enforced (max N keepers)
- [ ] Keepers retained across seasons

---

## Phase 6: Polish & Testing (Week 11)

**Priority: HIGH** - Final cleanup before launch.

### Tasks

1. **Mobile responsiveness** (2 days)
   - Test all pages on mobile (iPhone, Android)
   - Fix layout issues
   - Ensure tables scroll on small screens

2. **Error handling** (1 day)
   - Add user-friendly error messages
   - Handle API failures gracefully
   - Show loading states

3. **Performance** (1 day)
   - Optimize slow queries
   - Add database indexes
   - Test with 100+ players, 20+ teams

4. **Testing** (2 days)
   - Expand unit test coverage (utils)
   - Integration tests for critical flows
   - Manual end-to-end testing

5. **Documentation** (1 day)
   - User guide for commissioners
   - FAQ for common questions
   - Update README with deployment instructions

### Verification

- [ ] All pages load under 2 seconds
- [ ] Mobile UI fully functional
- [ ] No console errors in production
- [ ] 80%+ test coverage on utils
- [ ] End-to-end flow works: signup → create league → draft → matchup → scores

---

## Critical Files Summary

### Files to Create (New)

**Authentication (Phase 1):**
- `middleware.ts`
- `lib/auth/server.ts`
- `lib/auth/client.ts`
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`
- `app/auth/callback/route.ts`
- `components/auth/AuthProvider.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/UserMenu.tsx`

**ETL (Phase 2):**
- `lib/etl/sources/fantrax/client.ts`
- `lib/etl/sources/fantrax/players.ts`
- `lib/etl/sources/fantrax/stats.ts`
- `lib/etl/transformers/nhl/players.ts`
- `lib/etl/transformers/nhl/stats.ts`
- `lib/etl/loaders/players.ts`
- `lib/etl/loaders/stats.ts`
- `lib/etl/jobs/sync-daily-stats.ts`
- `app/api/admin/etl/sync-players/route.ts`
- `app/api/cron/daily-stats/route.ts`

**Matchups (Phase 3):**
- `lib/utils/matchups.ts`
- `lib/utils/standings.ts`
- `app/api/leagues/[id]/matchups/generate/route.ts`
- `app/api/leagues/[id]/matchups/route.ts`
- `app/api/leagues/[id]/standings/route.ts`
- `app/api/cron/calculate-scores/route.ts`
- `app/leagues/[id]/matchups/page.tsx`
- `app/leagues/[id]/standings/page.tsx`
- `components/matchups/MatchupCard.tsx`
- `components/standings/StandingsTable.tsx`

**Waivers/Trades (Phase 4):**
- `app/api/leagues/[id]/waivers/route.ts`
- `app/api/leagues/[id]/trades/route.ts`
- `app/api/trades/[id]/accept/route.ts`
- `app/leagues/[id]/waivers/page.tsx`
- `app/leagues/[id]/trades/page.tsx`
- `components/waivers/WaiverForm.tsx`
- `components/trades/TradeProposal.tsx`

### Files to Modify (Existing)

**Schema (All Phases):**
- `lib/db/schema.ts` - Add profiles, matchups, weeklyScores, standings, waiverClaims, trades tables

**API Routes (Phase 1 - Auth):**
- All existing API routes in `app/api/leagues/`, `app/api/drafts/`, `app/api/fantasy-teams/`
- Add `requireAuth()` and replace `user_test_1`

**Layout (Phase 1):**
- `app/layout.tsx` - Wrap with AuthProvider
- `components/navigation.tsx` - Add user menu

**Configuration (Phase 2):**
- `vercel.json` - Add cron schedules
- `.env.local` - Add Fantrax API credentials

---

## Database Migrations

**Migration Order:**

1. **Phase 1**: `bun run db:generate` → Creates profiles table
2. **Phase 2**: `bun run db:generate` → Adds dataSyncJobs, updates players/games
3. **Phase 3**: `bun run db:generate` → Adds matchups, weeklyScores, standings
4. **Phase 4**: `bun run db:generate` → Adds waiverClaims, trades, tradeItems
5. **Phase 5**: `bun run db:generate` → Updates rosters, fantasyTeams (optional)

**Apply to Production:**
```bash
bun run db:migrate  # Run after each phase
```

---

## Environment Variables Checklist

```env
# Existing
NEXT_PUBLIC_SUPABASE_URL=fvxthqcqumkskrwklrmu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<existing>
DATABASE_URL=<existing>

# Phase 1 - Add
SUPABASE_SERVICE_ROLE_KEY=<from_supabase_dashboard>

# Phase 2 - Add
FANTRAX_API_KEY=<from_fantrax>
FANTRAX_BASE_URL=https://api.fantrax.com
```

---

## Testing Strategy

### Unit Tests (Expand Coverage)
- `lib/utils/fantasy.test.ts` - Already exists ✓
- `lib/utils/draft.test.ts` - Already exists ✓
- `lib/utils/matchups.test.ts` - Create new
- `lib/utils/standings.test.ts` - Create new
- `lib/etl/transformers/nhl/players.test.ts` - Create new
- `lib/auth/server.test.ts` - Create new

### Integration Tests (API Routes)
- Auth flow: signup → login → protected route
- ETL flow: fetch → transform → load
- Draft flow: create league → generate matchups → draft
- Scoring flow: calculate weekly scores → update standings
- Trade flow: propose → accept → execute

### Manual End-to-End Test

**Complete User Journey:**
1. Sign up with email/password
2. Create dynasty league (6 teams, 3 keepers)
3. Invite 5 friends to join
4. Start snake draft, draft full rosters
5. Designate 3 keepers per team
6. Generate season matchups (5 weeks)
7. Week 1: Add/drop players via waivers
8. Week 1: Propose trade, accept trade
9. Week 1 ends: Scores calculate automatically
10. Check standings (wins/losses updated)
11. Repeat for weeks 2-5
12. Verify all features work on mobile

---

## Deployment Checklist

### Pre-Deployment
- [ ] All migrations tested on staging database
- [ ] Environment variables added to Vercel
- [ ] Supabase Auth configured (email templates, OAuth providers)
- [ ] Fantrax API credentials validated
- [ ] vercel.json with cron schedules committed
- [ ] All tests passing

### Initial Deployment
- [ ] Deploy to Vercel
- [ ] Run database migrations: `bun run db:migrate`
- [ ] Run initial player sync (manual trigger)
- [ ] Run initial schedule sync (manual trigger)
- [ ] Verify cron jobs scheduled in Vercel dashboard

### Post-Deployment
- [ ] Create test user account
- [ ] Create test league
- [ ] Complete test draft
- [ ] Verify daily stats cron runs successfully
- [ ] Monitor for errors in Vercel logs

---

## MVP Launch Criteria

**Must Have:**
- [ ] User authentication (signup, login, logout)
- [ ] Real NHL player data (50+ players with current stats)
- [ ] Daily automated stat updates
- [ ] League creation and management
- [ ] Snake draft (working end-to-end)
- [ ] Weekly matchups (auto-generated)
- [ ] Scoring calculation (accurate fantasy points)
- [ ] League standings (wins/losses tracked)
- [ ] Waiver wire (add/drop players)
- [ ] Trade system (propose/accept/reject)
- [ ] Mobile responsive UI
- [ ] No critical bugs or security issues

**Nice to Have (Can Defer to v1.1):**
- [ ] Dynasty/keeper support
- [ ] Team customization (colors, logos)
- [ ] Auction draft type
- [ ] Advanced waiver priority system
- [ ] Commissioner override tools
- [ ] Playoff brackets

---

## Risk Mitigation

### High-Risk Areas

1. **Fantrax API Reliability**
   - **Mitigation**: Implement retry logic, cache data, monitor sync job status
   - **Fallback**: Manual CSV import option if API unavailable

2. **Scoring Accuracy**
   - **Mitigation**: Extensive unit tests, manual verification, beta test with sample data
   - **Validation**: Compare calculated scores against manual calculations

3. **Vercel Free Tier Timeout (10s)**
   - **Mitigation**: Optimize queries, batch operations, monitor API response times
   - **Upgrade Path**: Move to Vercel Pro if timeouts occur ($20/mo)

4. **Database Performance**
   - **Mitigation**: Add indexes on foreign keys, use `inArray()` for batch queries
   - **Monitoring**: Check slow query logs in Supabase dashboard

---

## Post-MVP Roadmap

### v1.1 (Post-Launch)
- Dynasty/keeper system (if deferred)
- Auction draft implementation
- Advanced analytics (player projections)
- League chat/messaging
- Commissioner override tools

### v1.2 (Future)
- Playoff brackets
- Multi-sport support (NFL, NBA)
- Trade analyzer
- Player news integration
- Push notifications

---

## Timeline Estimate

| Phase | Duration | Parallel? |
|-------|----------|-----------|
| Phase 1: Authentication | 2 weeks | No |
| Phase 2: Fantrax ETL | 2 weeks | No (depends on auth) |
| Phase 3: Matchups/Scoring | 3 weeks | No (depends on data) |
| Phase 4: Waivers/Trades | 2 weeks | Yes (can overlap with 5) |
| Phase 5: Dynasty/Keeper | 1 week | Yes (optional) |
| Phase 6: Polish/Testing | 1 week | No |
| **Total (without Phase 5)** | **10 weeks** | |
| **Total (with Phase 5)** | **11 weeks** | |

**Assumptions:**
- Single full-time developer
- Flexible timeline (quality over speed)
- Minimal scope creep
- Fantrax API documentation is clear

---

## Success Metrics

**Beta Test (Pre-Launch):**
- 2-3 test leagues run for 3-4 weeks
- Zero scoring calculation errors
- 95%+ uptime for ETL jobs
- All core features tested on mobile

**Public Launch (Month 1):**
- 50+ users signed up
- 10+ active leagues
- Daily ETL jobs run successfully (100% success rate)
- < 2s average page load time
- < 5% error rate on API routes
- Mobile traffic > 40% of total

**Post-Launch (Month 3):**
- 200+ users
- 30+ active leagues
- User retention > 60% week-over-week
- Positive user feedback (NPS > 40)
