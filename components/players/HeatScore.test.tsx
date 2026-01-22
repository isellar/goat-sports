import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeatScore } from './HeatScore';

describe('HeatScore', () => {
  describe('Display', () => {
    it('should show 🔥 for positive scores', () => {
      const { container } = render(<HeatScore score={3} />);
      
      // Check for fire emoji in the rendered HTML
      const html = container.innerHTML;
      const fireCount = (html.match(/🔥/g) || []).length;
      expect(fireCount).toBe(3);
    });

    it('should show ❄️ for negative scores', () => {
      const { container } = render(<HeatScore score={-3} />);
      
      // Check for ice emoji in the rendered HTML
      const html = container.innerHTML;
      const iceCount = (html.match(/❄️/g) || []).length;
      expect(iceCount).toBe(3);
    });

    it('should display correct number of icons (-3 to 3)', () => {
      const { container, rerender } = render(<HeatScore score={2} />);
      let html = container.innerHTML;
      let fireCount = (html.match(/🔥/g) || []).length;
      expect(fireCount).toBe(2);

      rerender(<HeatScore score={-2} />);
      html = container.innerHTML;
      const iceCount = (html.match(/❄️/g) || []).length;
      expect(iceCount).toBe(2);

      rerender(<HeatScore score={1} />);
      html = container.innerHTML;
      fireCount = (html.match(/🔥/g) || []).length;
      expect(fireCount).toBe(1);
    });

    it('should handle zero score', () => {
      render(<HeatScore score={0} />);
      
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.queryByText('🔥')).not.toBeInTheDocument();
      expect(screen.queryByText('❄️')).not.toBeInTheDocument();
    });

    it('should handle null/undefined', () => {
      const { rerender } = render(<HeatScore score={null} />);
      expect(screen.getByText('-')).toBeInTheDocument();

      rerender(<HeatScore score={undefined} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should cap icons at maxCount (3)', () => {
      const { container } = render(<HeatScore score={5} />);
      
      const html = container.innerHTML;
      const fireCount = (html.match(/🔥/g) || []).length;
      expect(fireCount).toBe(3); // Capped at 3
    });

    it('should handle negative scores beyond -3', () => {
      const { container } = render(<HeatScore score={-5} />);
      
      const html = container.innerHTML;
      const iceCount = (html.match(/❄️/g) || []).length;
      expect(iceCount).toBe(3); // Capped at 3
    });
  });
});
