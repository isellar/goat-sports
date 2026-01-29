/**
 * Fantrax API Client for TypeScript/Node.js
 *
 * Note: Fantrax does not have an official public API. This client
 * will need to be enhanced with actual endpoint calls by inspecting
 * network requests from the Fantrax web interface.
 *
 * For now, this provides the structure and type safety.
 */

import type {
  FantraxAPIConfig,
  FantraxTeam,
  FantraxPlayer,
  FantraxRoster,
  FantraxLeague,
} from '../types/fantrax';

export class FantraxAPIClient {
  private leagueId: string;
  private baseUrl: string;
  private cookie?: string;

  constructor(config: FantraxAPIConfig) {
    this.leagueId = config.leagueId;
    this.baseUrl = config.baseUrl || 'https://www.fantrax.com/fxea/general';
    this.cookie = config.cookie || process.env.FANTRAX_COOKIE;
  }

  /**
   * Fetch all fantasy teams in the league
   */
  async getTeams(): Promise<FantraxTeam[]> {
    // TODO: Implement actual API call
    // This would call Fantrax endpoints discovered by inspecting network traffic
    console.warn('FantraxAPIClient.getTeams() is not yet implemented');
    return [];
  }

  /**
   * Fetch roster information for a specific fantasy team
   */
  async getRosterInfo(teamId: string): Promise<FantraxRoster> {
    // TODO: Implement actual API call
    console.warn('FantraxAPIClient.getRosterInfo() is not yet implemented');
    return {
      team_id: teamId,
      rows: [],
    };
  }

  /**
   * Fetch all players in the league
   */
  async getPlayers(): Promise<FantraxPlayer[]> {
    // TODO: Implement actual API call
    console.warn('FantraxAPIClient.getPlayers() is not yet implemented');
    return [];
  }

  /**
   * Fetch league information
   */
  async getLeagueInfo(): Promise<FantraxLeague> {
    // TODO: Implement actual API call
    console.warn('FantraxAPIClient.getLeagueInfo() is not yet implemented');
    return {
      league_id: this.leagueId,
      name: 'Unknown League',
      sport: 'NHL',
    };
  }

  /**
   * Alternative: Call the existing Python fantraxapi via a child process
   * This is a temporary solution until we reverse-engineer the endpoints
   */
  private async callPythonFantraxAPI(method: string, params: any = {}): Promise<any> {
    // TODO: Implement calling the Python script from the goat-data directory
    // This would use child_process.spawn() to run the Python ingestors
    throw new Error('Python bridge not yet implemented');
  }
}

/**
 * Singleton instance
 */
let fantraxClient: FantraxAPIClient | null = null;

export function getFantraxClient(config?: FantraxAPIConfig): FantraxAPIClient {
  if (!fantraxClient && !config) {
    throw new Error('FantraxAPIClient must be initialized with config on first call');
  }

  if (config) {
    fantraxClient = new FantraxAPIClient(config);
  }

  return fantraxClient!;
}
