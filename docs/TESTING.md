# Testing Plan

## Overview

This document outlines the comprehensive testing strategy for GOAT Sports. The testing plan is designed to ensure reliability, maintainability, and confidence in deployments as the application grows.

## Testing Philosophy

- **Test Critical Paths First**: Focus on business logic, data integrity, and user-facing features
- **Progressive Coverage**: Start with high-value tests, expand coverage incrementally
- **Fast Feedback**: Unit tests should be fast, integration tests should be reliable
- **Real-World Scenarios**: Tests should reflect actual usage patterns
- **Maintainable Tests**: Tests should be easy to read, update, and maintain

## Testing Stack

### Recommended Tools

#### Unit & Integration Testing
- **Vitest**: Fast, Vite-native test runner (compatible with Next.js)
  - Excellent TypeScript support
  - Fast execution
  - Jest-compatible API
  - Built-in coverage reporting

#### Component Testing
- **React Testing Library**: Component testing utilities
  - Encourages testing user behavior, not implementation
  - Accessible by default
  - Works with Vitest

#### E2E Testing
- **Playwright**: End-to-end testing framework
  - Cross-browser testing
  - Mobile device emulation
  - Visual regression testing
  - Network interception for API mocking

#### Database Testing
- **Drizzle Kit**: Database migrations and testing
- **Test Containers** (optional): Isolated database instances for testing
- **In-memory SQLite**: Fast database tests (if compatible with Drizzle)

#### API Testing
- **Vitest**: For API route testing
- **Supertest** (optional): HTTP assertion library

### Installation

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npm install -D @vitest/coverage-v8
```

## Test Structure

```
goat-sports/
├── __tests__/                    # Test utilities and setup
│   ├── setup.ts                  # Test environment setup
│   ├── db-setup.ts               # Database test utilities
│   └── mocks/                    # Mock data and utilities
│       ├── players.ts
│       ├── teams.ts
│       └── games.ts
├── app/
│   └── api/
│       └── players/
│           └── route.test.ts     # API route tests
├── lib/
│   ├── utils/
│   │   ├── fantasy.test.ts       # Fantasy calculation tests
│   │   └── player.test.ts        # Player utility tests
│   └── db/
│       └── schema.test.ts        # Schema validation tests
├── components/
│   └── players/
│       ├── PlayerCard.test.tsx   # Component tests
│       ├── PlayerTableRow.test.tsx
│       └── HeatScore.test.tsx
└── e2e/
    ├── players.spec.ts           # E2E test suites
    ├── leagues.spec.ts
    └── auth.spec.ts
```

## Test Categories

### 1. Unit Tests

#### Priority: High
**Focus**: Business logic, calculations, utilities

#### Fantasy Points Calculations (`lib/utils/fantasy.ts`)
- [ ] **Skater Fantasy Points**
  - Calculate points for forward with goals and assists
  - Calculate points for defenseman
  - Handle zero stats correctly
  - Handle null/undefined stats
  - Verify scoring formula (Goals: 3pts, Assists: 2pts, +/-: 0.5pts)
  - Test edge cases (negative plus/minus, zero goals)

- [ ] **Goalie Fantasy Points**
  - Calculate points for goalie with wins/losses
  - Calculate shutout bonus
  - Handle zero stats correctly
  - Verify scoring formula (Win: 3pts, Loss: -1pt, Shutout: 2pts)
  - Test edge cases (all losses, all wins)

- [ ] **Fantasy Points Per Game**
  - Calculate FP/G for skater with known games played
  - Calculate FP/G for goalie
  - Handle zero games played (should return 0)
  - Handle estimated games played
  - Test division by zero protection

- [ ] **Games Played Estimation**
  - Estimate GP for goalie (wins + losses)
  - Estimate GP for skater with points
  - Handle zero stats (should return 0)
  - Test edge cases

#### Player Utilities (`lib/utils/player.ts`)
- [ ] **Age Calculation**
  - Calculate age from date of birth
  - Handle null/undefined date of birth
  - Handle future dates (edge case)
  - Handle leap years

- [ ] **Game Date Formatting**
  - Format game dates correctly
  - Handle timezone conversions
  - Format relative dates (today, tomorrow)

- [ ] **Slate Detection**
  - Identify games in "next slate" (today/tomorrow)
  - Handle timezone edge cases
  - Handle games outside slate window

#### Data Validation
- [ ] **Schema Validation**
  - Validate player data structure
  - Validate team data structure
  - Validate game data structure
  - Test required fields
  - Test enum values (position, status)

### 2. Integration Tests

#### Priority: High
**Focus**: API routes, database operations, data flow

#### API Routes

##### `/api/players` Route
- [ ] **GET - Basic Functionality**
  - Return list of players
  - Return correct data structure
  - Include team information
  - Include next game information

- [ ] **GET - Search Functionality**
  - Search by player name (exact match)
  - Search by player name (partial match)
  - Search case-insensitive
  - Handle special characters in search
  - Return empty array for no matches

- [ ] **GET - Filtering**
  - Filter by position (C, LW, RW, D, G)
  - Filter by team ID
  - Filter by minimum points
  - Filter by minimum goals
  - Combine multiple filters
  - Handle invalid filter values

- [ ] **GET - Sorting**
  - Sort by name (ascending/descending)
  - Sort by points (ascending/descending)
  - Sort by goals (ascending/descending)
  - Sort by assists (ascending/descending)
  - Sort by plus/minus
  - Sort by position
  - Sort by team name
  - Handle null values in sorting
  - Verify secondary sort (name) when primary values are equal

- [ ] **GET - Pagination**
  - Return correct limit of results
  - Handle offset correctly
  - Return total count
  - Handle limit > total count
  - Handle negative limit/offset
  - Handle very large limit values

- [ ] **GET - Next Game Data**
  - Include next scheduled game for each player
  - Include home/away team information
  - Only include future games
  - Only include scheduled games
  - Handle players without teams
  - Handle teams without upcoming games

- [ ] **Error Handling**
  - Handle database connection errors
  - Handle invalid query parameters
  - Return appropriate HTTP status codes
  - Return meaningful error messages
  - Log errors appropriately

##### `/api/teams` Route
- [ ] **GET - Basic Functionality**
  - Return all teams
  - Return correct data structure
  - Include all required fields

- [ ] **Error Handling**
  - Handle database errors
  - Return appropriate status codes

##### `/api/leagues` Route
- [ ] **GET - List Leagues**
  - Return user's leagues
  - Filter by status
  - Include league metadata

- [ ] **POST - Create League**
  - Create league with valid data
  - Validate required fields
  - Set commissioner correctly
  - Set default values
  - Handle duplicate names
  - Validate scoring settings

- [ ] **GET - Get League by ID**
  - Return league details
  - Include teams and members
  - Handle non-existent league
  - Verify authorization

- [ ] **POST - Join League**
  - Join existing league
  - Check league capacity
  - Handle duplicate joins
  - Verify league status allows joining

##### `/api/health` Route
- [ ] **GET - Health Check**
  - Return 200 when healthy
  - Check database connectivity
  - Return service status

#### Database Operations

##### Player Queries
- [ ] **Query Performance**
  - Test query execution time
  - Verify index usage
  - Test with large datasets (1000+ players)
  - Test complex filter combinations

- [ ] **Data Integrity**
  - Verify foreign key constraints
  - Test cascade deletes (if applicable)
  - Verify unique constraints
  - Test enum value constraints

##### Transaction Testing
- [ ] **League Creation**
  - Create league atomically
  - Create commissioner team
  - Create membership record
  - Rollback on error

- [ ] **Player Roster Operations**
  - Add player to roster
  - Remove player from roster
  - Update lineup position
  - Verify roster size limits

### 3. Component Tests

#### Priority: Medium
**Focus**: UI components, user interactions, accessibility

#### Player Components

##### `PlayerCard`
- [ ] **Rendering**
  - Render player name and jersey number
  - Display position and team
  - Show age correctly
  - Display status badge
  - Apply status gradient colors

- [ ] **Status Display**
  - Display DTD status (yellow)
  - Display IR status (red)
  - Display Minors status (yellow)
  - Hide status for healthy players
  - Test all status types

- [ ] **Accessibility**
  - Proper ARIA labels
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast compliance

##### `PlayerTableRow`
- [ ] **Rendering**
  - Display all columns correctly
  - Format numbers correctly
  - Display next opponent
  - Highlight slate games
  - Show expand button

- [ ] **Interactions**
  - Expand stats modal on click
  - Close modal correctly
  - Handle keyboard interactions

##### `HeatScore`
- [ ] **Display**
  - Show 🔥 for positive scores
  - Show ❄️ for negative scores
  - Display correct number of icons (-3 to 3)
  - Handle zero score
  - Handle null/undefined

##### `TrendScore`
- [ ] **Display**
  - Show trending up icon for positive
  - Show trending down icon for negative
  - Display score correctly
  - Handle zero score

##### `PlayerStatsModal`
- [ ] **Rendering**
  - Display skater stats correctly
  - Display goalie stats correctly
  - Show correct stats based on position
  - Format numbers correctly

- [ ] **Interactions**
  - Open modal correctly
  - Close modal on button click
  - Close modal on backdrop click
  - Handle escape key

##### `SortableTableHead`
- [ ] **Sorting**
  - Toggle sort direction on click
  - Display sort indicator
  - Handle initial sort state
  - Reset sort correctly

#### Navigation Components
- [ ] **Navigation**
  - Highlight active page
  - Navigate to correct routes
  - Theme toggle functionality
  - Mobile menu (when implemented)

### 4. End-to-End Tests

#### Priority: Medium (High for critical flows)
**Focus**: Complete user workflows, cross-browser compatibility

#### Player Search Flow
- [ ] **Complete Search Workflow**
  1. Navigate to players page
  2. Search for player by name
  3. Verify results displayed
  4. Filter by position
  5. Sort by points
  6. Open player stats modal
  7. Verify modal displays correctly
  8. Close modal

#### League Management Flow
- [ ] **Create and Join League**
  1. Navigate to leagues page
  2. Create new league
  3. Verify league created
  4. Join league (as different user)
  5. Verify membership
  6. View league details

#### Draft Flow (Future)
- [ ] **Complete Draft Process**
  1. Start draft
  2. Select player
  3. Verify player added to roster
  4. Verify turn passes to next user
  5. Complete draft
  6. Verify final rosters

#### Scoring Flow (Future)
- [ ] **Matchup Scoring**
  1. View matchup page
  2. Verify scores calculated correctly
  3. Verify real-time updates
  4. Verify standings updated

### 5. ETL Pipeline Tests

#### Priority: High (when ETL is implemented)
**Focus**: Data transformation, error handling, data quality

#### Data Source Adapters
- [ ] **API Integration**
  - Fetch data from external API
  - Handle API rate limits
  - Handle API errors gracefully
  - Retry failed requests
  - Parse API responses correctly

#### Data Transformers
- [ ] **Data Transformation**
  - Transform API data to schema format
  - Handle missing fields
  - Validate data types
  - Handle date/time conversions
  - Calculate derived fields (fantasy points)

- [ ] **Data Validation**
  - Validate required fields
  - Validate data ranges
  - Validate enum values
  - Detect duplicate records
  - Flag data quality issues

#### Data Loaders
- [ ] **Database Loading**
  - Insert new records
  - Update existing records
  - Handle duplicate key errors
  - Batch insert performance
  - Transaction rollback on error

- [ ] **Error Handling**
  - Handle database connection errors
  - Handle constraint violations
  - Log errors appropriately
  - Retry failed operations
  - Dead letter queue for failed records

### 6. Performance Tests

#### Priority: Low (Medium for production)
**Focus**: Response times, load handling, scalability

#### API Performance
- [ ] **Response Time Targets**
  - Player list API < 200ms (p95)
  - Search API < 300ms (p95)
  - Complex queries < 500ms (p95)

- [ ] **Load Testing**
  - Handle 100 concurrent requests
  - Handle 1000 concurrent requests
  - Test database connection pooling
  - Test query performance under load

#### Frontend Performance
- [ ] **Lighthouse Scores**
  - FCP < 1.5s
  - LCP < 2.5s
  - TTI < 3.5s
  - CLS < 0.1
  - FID < 100ms

- [ ] **Bundle Size**
  - Monitor bundle size
  - Test code splitting
  - Verify tree shaking

### 7. Security Tests

#### Priority: High
**Focus**: Authentication, authorization, data protection

#### Authentication (when implemented)
- [ ] **Login Flow**
  - Valid credentials succeed
  - Invalid credentials fail
  - Handle expired sessions
  - Handle token refresh

- [ ] **Authorization**
  - Users can only access their data
  - League members can only access their league
  - Commissioners have correct permissions
  - API routes enforce authentication

#### Input Validation
- [ ] **SQL Injection Prevention**
  - Test parameterized queries
  - Test input sanitization
  - Verify Drizzle ORM protection

- [ ] **XSS Prevention**
  - Test user input sanitization
  - Verify React escaping
  - Test script injection attempts

- [ ] **CSRF Protection**
  - Verify CSRF tokens (if implemented)
  - Test cross-origin requests

#### API Security
- [ ] **Rate Limiting**
  - Enforce rate limits
  - Handle rate limit exceeded
  - Different limits for different endpoints

- [ ] **CORS Configuration**
  - Verify CORS headers
  - Test cross-origin requests
  - Verify allowed origins

## Test Data Management

### Test Fixtures
- Create reusable test data factories
- Use realistic but anonymized data
- Maintain separate test database
- Seed test data before test suites

### Mock Data
```typescript
// __tests__/mocks/players.ts
export const mockPlayer = {
  id: 'player-1',
  name: 'Connor McDavid',
  position: 'C',
  teamId: 'team-1',
  goals: 50,
  assists: 70,
  points: 120,
  // ... other fields
};
```

### Database Test Setup
- Use separate test database
- Run migrations before tests
- Clean database between tests (or use transactions)
- Use database transactions for isolation

## Test Execution

### Local Development
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- players.test.ts

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

### CI/CD Integration
- Run tests on every PR
- Run tests on merge to main
- Block merges on test failures
- Generate coverage reports
- Upload coverage to service (Codecov, etc.)

### Pre-commit Hooks
- Run linting
- Run type checking
- Run unit tests
- Run affected tests only (optional)

## Coverage Goals

### Initial Targets
- **Unit Tests**: 80% coverage for business logic
  - Fantasy calculations: 100%
  - Player utilities: 90%
  - Data validation: 85%

- **Integration Tests**: 70% coverage for API routes
  - Critical endpoints: 100%
  - All endpoints: 70%

- **Component Tests**: 60% coverage
  - Critical components: 100%
  - All components: 60%

- **E2E Tests**: Cover critical user flows
  - Player search: 100%
  - League management: 100%
  - Draft flow: 100% (when implemented)

### Long-term Targets
- Overall code coverage: 80%
- Critical path coverage: 95%
- Business logic coverage: 90%

## Testing Best Practices

### Writing Tests
1. **Arrange-Act-Assert Pattern**
   ```typescript
   test('calculates fantasy points correctly', () => {
     // Arrange
     const player = { goals: 10, assists: 15, plusMinus: 5 };
     
     // Act
     const points = calculateFantasyPoints(player);
     
     // Assert
     expect(points).toBe(50); // 10*3 + 15*2 + 5*0.5
   });
   ```

2. **Descriptive Test Names**
   - Use clear, descriptive test names
   - Describe what is being tested and expected outcome
   - Example: `'should return empty array when no players match search criteria'`

3. **Test Isolation**
   - Each test should be independent
   - Don't rely on test execution order
   - Clean up after tests

4. **Test Real Behavior**
   - Test user-facing behavior, not implementation
   - Avoid testing implementation details
   - Focus on outcomes, not internals

5. **Use Appropriate Assertions**
   - Use specific matchers
   - Test edge cases
   - Test error conditions

### Maintaining Tests
1. **Keep Tests Updated**
   - Update tests when code changes
   - Remove obsolete tests
   - Refactor tests when needed

2. **Fast Tests**
   - Keep unit tests fast (< 100ms each)
   - Use mocks for slow operations
   - Parallelize test execution

3. **Reliable Tests**
   - Avoid flaky tests
   - Don't rely on timing
   - Use deterministic test data

4. **Readable Tests**
   - Use clear variable names
   - Add comments for complex logic
   - Group related tests

## Test Implementation Roadmap

### Phase 1: Foundation (Current)
- [ ] Set up Vitest and testing infrastructure
- [ ] Create test utilities and mocks
- [ ] Write unit tests for fantasy calculations
- [ ] Write unit tests for player utilities
- [ ] Set up test database

### Phase 2: API Testing
- [ ] Write integration tests for `/api/players`
- [ ] Write integration tests for `/api/teams`
- [ ] Write integration tests for `/api/leagues`
- [ ] Write integration tests for `/api/health`

### Phase 3: Component Testing
- [ ] Write tests for PlayerCard
- [ ] Write tests for PlayerTableRow
- [ ] Write tests for HeatScore and TrendScore
- [ ] Write tests for PlayerStatsModal
- [ ] Write tests for SortableTableHead

### Phase 4: E2E Testing
- [ ] Set up Playwright
- [ ] Write E2E tests for player search flow
- [ ] Write E2E tests for league management
- [ ] Set up CI/CD for E2E tests

### Phase 5: ETL Testing (when ETL is implemented)
- [ ] Write tests for data source adapters
- [ ] Write tests for data transformers
- [ ] Write tests for data loaders
- [ ] Write tests for error handling

### Phase 6: Performance & Security
- [ ] Set up performance testing
- [ ] Write security tests
- [ ] Set up monitoring and alerting

## Continuous Improvement

### Regular Reviews
- Review test coverage monthly
- Identify gaps in test coverage
- Refactor slow or flaky tests
- Update test documentation

### Metrics to Track
- Test coverage percentage
- Test execution time
- Flaky test rate
- Test failure rate
- Time to fix failing tests

### Learning and Adaptation
- Stay updated with testing best practices
- Experiment with new testing tools
- Share learnings with team
- Iterate on testing strategy

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Drizzle ORM Testing](https://orm.drizzle.team/docs/overview)

### Testing Patterns
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Notes

- Tests should be written alongside features, not after
- Aim for fast feedback loops
- Focus on testing behavior, not implementation
- Maintain test code quality as high as production code
- Use tests as documentation for how code should work
