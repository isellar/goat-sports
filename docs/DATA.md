# Data

## Data Sources

### Primary Sports Data APIs
- **SportsDataIO** (Primary candidate)
  - NFL, NBA, MLB, NHL data
  - Real-time scores, stats, schedules
  - Player information and injury reports
  - Rate limits: Varies by plan
  - Authentication: API key required
  - Cost: Subscription-based ($50-$500+/month depending on tier)

- **ESPN API** (Alternative/Supplement)
  - Public data available (unofficial APIs)
  - May require web scraping for some data
  - Free but rate-limited
  - Less reliable than paid services

- **TheSportsDB** (Free alternative)
  - Free tier available
  - Limited data compared to paid services
  - Good for basic player/team information
  - Rate limits apply

### Weather Data
- **OpenWeatherMap API**
  - Game day weather conditions
  - Impact on player performance (outdoor sports)
  - Free tier: 1,000 calls/day
  - Paid tiers for higher volume

- **WeatherAPI.com** (Alternative)
  - Similar functionality
  - Competitive pricing
  - Good documentation

### News & Injury Reports
- **NewsAPI**
  - Sports news aggregation
  - Injury updates and player news
  - Free tier: 100 requests/day
  - Paid tiers available

- **RSS Feeds** (Free)
  - ESPN, NFL.com, team websites
  - Requires parsing and processing
  - No API costs but more maintenance

### Real-time Score Updates
- **SportsDataIO Real-time** (if available)
  - Live game updates
  - Play-by-play data
  - Higher tier subscription required

- **WebSocket Services**
  - Custom real-time score feeds
  - May require scraping or partnerships

### Data Source Strategy
1. **Start with SportsDataIO** for reliable, comprehensive data
2. **Supplement with free sources** where possible (weather, news)
3. **Build scrapers** for data not available via API (as needed)
4. **Cache aggressively** to minimize API calls and costs
5. **Implement rate limiting** and retry logic for all external calls

## Database Schema Overview

### Core Entities

#### Users
- User accounts, authentication, profiles
- Preferences, settings, subscription status
- Relationships: Leagues (many-to-many), Teams (one-to-many)

#### Players
- Player information (name, position, team, stats)
- Historical and current season data
- Relationships: Teams (many-to-one), Stats (one-to-many), Rosters (many-to-many)

#### Teams (Sports Teams)
- NFL/NBA/etc. teams
- Conference, division, location data
- Relationships: Players (one-to-many), Games (one-to-many as home/away)

#### Games
- Scheduled and completed games
- Scores, status, weather conditions
- Relationships: Teams (many-to-two), Stats (one-to-many)

#### Leagues
- Fantasy leagues
- Settings (scoring, roster, draft type)
- Relationships: Users (many-to-many), Teams (one-to-many), Drafts (one-to-one)

#### Teams (Fantasy Teams)
- User's fantasy team within a league
- Roster, lineup, standings
- Relationships: League (many-to-one), User (many-to-one), Players (many-to-many via Rosters)

#### Rosters
- Player assignments to fantasy teams
- Lineup positions, bench status
- Relationships: Team (many-to-one), Player (many-to-one)

#### Player Stats
- Game-by-game and season statistics
- Fantasy points calculated
- Relationships: Player (many-to-one), Game (many-to-one)

#### Drafts
- Draft events and picks
- Draft order, timer, status
- Relationships: League (one-to-one), Picks (one-to-many)

#### Transactions
- Trades, waivers, free agent pickups
- Approval status, timestamps
- Relationships: League (many-to-one), Teams (many-to-many)

### Indexing Strategy
- **Primary Keys**: All tables have UUID or string primary keys
- **Foreign Keys**: Indexed for join performance
- **Search Fields**: 
  - Player names (full-text search)
  - Team names
  - League names
- **Query Optimization**:
  - Composite indexes on common filter combinations (position + team + date range)
  - Date indexes for time-based queries
  - Status indexes for active/inactive filtering

### Data Relationships
- **One-to-Many**: Team → Players, League → Teams, User → Teams
- **Many-to-Many**: Users ↔ Leagues, Players ↔ Rosters
- **One-to-One**: League ↔ Draft

