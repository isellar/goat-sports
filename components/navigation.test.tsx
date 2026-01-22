import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from './navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Navigation', () => {
  it('should render navigation links', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Players')).toBeInTheDocument();
    expect(screen.getByText('Leagues')).toBeInTheDocument();
  });

  it('should highlight active page', () => {
    // Mock usePathname to return /players
    vi.doMock('next/navigation', () => ({
      usePathname: () => '/players',
    }));

    render(<Navigation />);
    
    const playersLink = screen.getByText('Players').closest('a');
    expect(playersLink).toHaveClass('bg-primary');
  });

  it('should navigate to correct routes', () => {
    render(<Navigation />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const playersLink = screen.getByText('Players').closest('a');
    const leaguesLink = screen.getByText('Leagues').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(playersLink).toHaveAttribute('href', '/players');
    expect(leaguesLink).toHaveAttribute('href', '/leagues');
  });

  it('should render theme toggle', () => {
    render(<Navigation />);
    
    // Theme toggle should be present (it's a button with sr-only text)
    // The button might not have accessible name, so we check for the component
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render logo', () => {
    render(<Navigation />);
    
    expect(screen.getByText('GOAT Sports')).toBeInTheDocument();
  });
});
