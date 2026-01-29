/**
 * Fantrax API Client for TypeScript/Node.js
 *
 * Reverse-engineered from the Python fantraxapi package (meisnate12/FantraxAPI).
 * Base endpoint: POST https://www.fantrax.com/fxpa/req
 *
 * The Fantrax API uses a POST request with a JSON body containing a "msgs" array.
 * Each message has a "method" (like "getFantasyTeams") and "data" object with leagueId.
 */

import type {
  FantraxAPIConfig,
  FantraxTeam,
  FantraxPlayer,
  FantraxRoster,
  FantraxLeague,
} from '../types/fantrax';

interface FantraxRequest {
  method: string;
  data: {
    leagueId: string;
    [key: string]: any;
  };
}

interface FantraxResponse {
  responses: Array<{
    data: any;
  }>;
  pageError?: {
    code?: string;
    message?: string;
  };
}

export class FantraxAPIClient {
  private leagueId: string;
  private baseUrl: string;
  private cookie?: string;

  constructor(config: FantraxAPIConfig) {
    this.leagueId = config.leagueId;
    this.baseUrl = config.baseUrl || 'https://www.fantrax.com/fxpa/req';
    this.cookie = config.cookie || process.env.FANTRAX_COOKIE;
  }

  /**
   * Make a request to the Fantrax API
   * @private
   */
  private async request(method: string, params: Record<string, any> = {}): Promise<any> {
    const requestData: FantraxRequest = {
      method,
      data: {
        leagueId: this.leagueId,
        ...params,
      },
    };

    const jsonData = {
      msgs: [requestData],
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.cookie) {
      headers['Cookie'] = this.cookie;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?leagueId=${this.leagueId}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(jsonData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseJson: FantraxResponse = await response.json();

      // Check for page errors
      if (responseJson.pageError) {
        if (responseJson.pageError.code === 'WARNING_NOT_LOGGED_IN') {
          throw new Error('Unauthorized: Not logged in to Fantrax');
        }
        throw new Error(`Fantrax API Error: ${JSON.stringify(responseJson.pageError)}`);
      }

      return responseJson.responses[0].data;
    } catch (error) {
      throw new Error(`Failed to connect to ${method}: ${error}`);
    }
  }

  /**
   * Fetch all fantasy teams in the league
   */
  async getTeams(): Promise<FantraxTeam[]> {
    const response = await this.request('getFantasyTeams');
    const teams: FantraxTeam[] = [];

    for (const data of response.fantasyTeams) {
      teams.push({
        team_id: data.id,
        name: data.name,
        abbreviation: data.shortName,
        owner: data.owner,
      });
    }

    return teams;
  }

  /**
   * Fetch roster information for a specific fantasy team
   */
  async getRosterInfo(teamId: string): Promise<FantraxRoster> {
    const response = await this.request('getTeamRosterInfo', { teamId });

    const rows = [];
    for (const group of response.tables || []) {
      for (const row of group.rows || []) {
        if ('scorer' in row || row.statusId === '1') {
          const player = row.scorer
            ? {
                id: row.scorer.scorerId,
                short_name: row.scorer.shortName,
                name: row.scorer.name,
                team_name: row.scorer.teamName,
                team_short_name: row.scorer.teamShortName || row.scorer.teamName,
                pos_short_name: row.scorer.posShortNames,
                injured: false,
                suspended: false,
              }
            : null;

          // Check for injury/suspension icons
          if (player && row.scorer?.icons) {
            for (const icon of row.scorer.icons) {
              if (['1', '2', '6'].includes(icon.typeId)) {
                // DtD, Out, IR
                player.injured = true;
              }
              if (icon.typeId === '6') {
                player.suspended = true;
              }
            }
          }

          rows.push({
            player,
            pos: null, // Would need positions mapping
            pos_id: row.posId,
            fppg: parseFloat(row.fppg || '0'),
          });
        }
      }
    }

    return {
      team_id: teamId,
      rows,
    };
  }

  /**
   * Fetch all players in the league (from all rosters)
   */
  async getPlayers(): Promise<FantraxPlayer[]> {
    const teams = await this.getTeams();
    const players: FantraxPlayer[] = [];
    const seenPlayers = new Set<string>();

    for (const team of teams) {
      const roster = await this.getRosterInfo(team.team_id);
      for (const row of roster.rows) {
        if (row.player && !seenPlayers.has(row.player.id)) {
          seenPlayers.add(row.player.id);
          players.push(row.player);
        }
      }
    }

    return players;
  }

  /**
   * Fetch league standings
   */
  async getStandings(): Promise<any> {
    return await this.request('getStandings');
  }

  /**
   * Fetch scoring periods
   */
  async getScoringPeriods(): Promise<any> {
    return await this.request('getStandings', { view: 'SCHEDULE' });
  }

  /**
   * Fetch league information
   */
  async getLeagueInfo(): Promise<FantraxLeague> {
    // Note: This method may need authentication
    // For now, return basic info
    return {
      league_id: this.leagueId,
      name: 'Fantrax League',
      sport: 'NHL',
    };
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
