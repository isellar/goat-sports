import { describe, it, expect } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

describe('/api/health', () => {
  describe('GET - Health Check', () => {
    it('should return 200 when healthy', async () => {
      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
    });

    it('should return service status', async () => {
      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET();
      const data = await response.json();

      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data.status).toBe('ok');
    });
  });
});
