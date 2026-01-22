import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendScore } from './TrendScore';

describe('TrendScore', () => {
  describe('Display', () => {
    it('should show trending up icon for positive', () => {
      const { container } = render(<TrendScore score={5} />);
      
      // Check for trending up icon (lucide-react TrendingUp renders as SVG)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      // Check for positive score display
      expect(screen.getByText('+5')).toBeInTheDocument();
    });

    it('should show trending down icon for negative', () => {
      const { container } = render(<TrendScore score={-3} />);
      
      // Check for trending down icon
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      // Check for negative score display
      expect(screen.getByText('-3')).toBeInTheDocument();
    });

    it('should display score correctly', () => {
      const { rerender } = render(<TrendScore score={10} />);
      expect(screen.getByText('+10')).toBeInTheDocument();

      rerender(<TrendScore score={-7} />);
      expect(screen.getByText('-7')).toBeInTheDocument();
    });

    it('should handle zero score', () => {
      const { container } = render(<TrendScore score={0} />);
      
      // Should show minus icon for zero
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle null/undefined', () => {
      const { container, rerender } = render(<TrendScore score={null} />);
      
      // Should default to 0 and show minus icon
      let svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      rerender(<TrendScore score={undefined} />);
      svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
