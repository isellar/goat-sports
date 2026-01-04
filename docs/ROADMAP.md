# Roadmap

## High-Level Plan

### Phase 1: Foundation & Migration (Current)
**Goal**: Establish modern architecture and migrate from existing React/Vite setup

**Tasks**:
- [x] Migrate from React Router to Next.js App Router
- [x] Set up Drizzle ORM with PostgreSQL schema
- [x] Create NHL player database schema (players, teams, games)
- [x] Set up Next.js API routes for player/team data
- [x] Build player list/search page with filtering
- [x] Implement player card component with status indicators
- [x] Add next opponent tracking with slate highlighting
- [x] Create expandable stats modal for detailed stats
- [x] Add heat score and trend score indicators
- [ ] Establish ETL pipeline structure for real data ingestion
- [x] Set up development environment and tooling

**Key Deliverables**:
- ✅ Working Next.js application with player search page
- ✅ Drizzle schema for NHL players, teams, and games
- ✅ Player filtering and sorting functionality
- ✅ Comprehensive stats tracking (skaters and goalies)
- ⏳ Basic ETL pipeline for ingesting player and game data (structure ready, needs real data source)
- ⏳ Authentication flow working with Supabase (infrastructure ready)

### Phase 2: Core Fantasy Sports Features
**Goal**: Complete essential fantasy sports functionality

**Tasks**:
- [x] Player database with advanced filtering (position, team, stats)
- [ ] Player database filtering by date ranges (needs game-by-game stats)
- [ ] League management (create, join, settings)
- [ ] Roster management (add/drop players, lineups)
- [ ] Draft system (snake draft, auction draft)
- [ ] Matchup tracking and scoring
- [ ] Standings and statistics
- [ ] Transaction history (trades, waivers, free agent pickups)

**Key Deliverables**:
- Fully functional fantasy league system
- Real-time scoring and matchup updates
- Comprehensive player search and filtering
- Draft interface with live updates

### Phase 3: Data Ingestion & Analytics
**Goal**: Robust data pipeline and advanced analytics

**Tasks**:
- [ ] Complete ETL pipeline for multiple sports (NFL, NBA, etc.)
- [ ] Scheduled data ingestion (daily stats, weekly schedules)
- [ ] Real-time data updates during games
- [ ] Advanced analytics engine:
  - Player projections and forecasting
  - Trade analyzer
  - Lineup optimizer
  - Trend analysis and pattern recognition
- [ ] Historical data processing and storage

**Key Deliverables**:
- Automated daily/weekly data ingestion
- Real-time game updates
- Advanced analytics dashboard
- Predictive modeling for player performance

### Phase 4: Social Features & Engagement
**Goal**: Build community and engagement features

**Tasks**:
- [ ] User profiles and avatars
- [ ] League chat and messaging
- [ ] Sport-level forums and discussions
- [ ] Global leaderboards
- [ ] Social sharing (wins, achievements, insights)
- [ ] User-generated content (memes, analysis, predictions)
- [ ] Notification system (game updates, trade offers, etc.)

**Key Deliverables**:
- Active community features
- Social engagement tools
- Real-time notifications
- Content creation and sharing

### Phase 5: Monetization & Premium Features
**Goal**: Implement revenue streams and premium offerings

**Tasks**:
- [ ] Advertising integration
- [ ] Freemium model (free vs. premium tiers)
- [ ] Premium features:
  - Advanced analytics
  - Custom league types (dynasty, keeper)
  - Enhanced social tools
- [ ] Virtual currency system (points, tipping)
- [ ] Payment processing integration

**Key Deliverables**:
- Multiple revenue streams operational
- Premium feature set
- Virtual economy foundation
- Payment infrastructure

### Phase 6: Advanced Features & Expansion
**Goal**: Scale platform and add advanced capabilities

**Tasks**:
- [ ] Multi-sport support expansion
- [ ] Mobile app (React Native or PWA enhancement)
- [ ] API for third-party integrations
- [ ] Advanced league types (dynasty, auction, custom scoring)
- [ ] Performance optimization and scaling
- [ ] International expansion considerations

**Key Deliverables**:
- Scalable, performant platform
- Expanded feature set
- Mobile experience
- Developer ecosystem

