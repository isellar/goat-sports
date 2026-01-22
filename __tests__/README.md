# Test Suite

This directory contains the test infrastructure and utilities for GOAT Sports.

## Test Structure

```
__tests__/
├── setup.ts              # Test environment setup
├── db-setup.ts           # Database test utilities
└── mocks/                # Mock data
    ├── players.ts
    ├── teams.ts
    ├── games.ts
    └── leagues.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

### Unit Tests ✅
- **Fantasy Calculations** (`lib/utils/fantasy.test.ts`): 26 tests
  - Skater fantasy points calculation
  - Goalie fantasy points calculation
  - Fantasy points per game
  - Games played estimation
  - Edge cases and error handling

- **Player Utilities** (`lib/utils/player.test.ts`): 22 tests
  - Age calculation
  - Slate detection
  - Game date formatting
  - Edge cases (null, invalid dates, leap years)

### Integration Tests
- **API Routes**:
  - `/api/players` - Player search, filtering, sorting, pagination
  - `/api/teams` - Team listing
  - `/api/leagues` - League creation and listing
  - `/api/leagues/[id]` - League details and updates
  - `/api/leagues/[id]/join` - Joining leagues
  - `/api/health` - Health check

### Component Tests
- **Navigation** (`components/navigation.test.tsx`)
  - Navigation links rendering
  - Active page highlighting
  - Route navigation
  - Theme toggle

- **HeatScore** (`components/players/HeatScore.test.tsx`)
  - Fire/ice icon display
  - Score range handling
  - Edge cases

- **TrendScore** (`components/players/TrendScore.test.tsx`)
  - Trending up/down icons
  - Score display
  - Edge cases

## Notes

- API route tests use mocked database connections
- Component tests use jsdom environment
- Unit tests use node environment
- Some API tests may need adjustment based on actual database setup

## Future Improvements

- Add E2E tests with Playwright
- Add more comprehensive component tests
- Add performance tests
- Add security tests
- Set up CI/CD test automation
