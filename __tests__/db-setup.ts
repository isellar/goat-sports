import { vi } from 'vitest';

// Mock database for testing
// In a real scenario, you might use a test database or in-memory database
export function createMockDb() {
  // This is a simplified mock - in production you'd want a real test database
  // For now, we'll create a mock that can be used in tests
  return {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

// Helper to create mock query builders
export function createMockQueryBuilder() {
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
  };
}
