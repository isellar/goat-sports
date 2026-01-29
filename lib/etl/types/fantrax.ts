/**
 * Fantrax API Types
 * Based on the fantraxapi Python package structure
 */

export interface FantraxTeam {
  team_id: string;
  name: string;
  abbreviation?: string;
  owner?: string;
}

export interface FantraxPosition {
  id: string;
  short_name: string;
  long_name: string;
}

export interface FantraxPlayer {
  id: string;
  short_name: string;
  name: string;
  team_name?: string;
  team_short_name?: string;
  pos_short_name?: string;
  injured?: boolean;
  suspended?: boolean;
}

export interface FantraxRosterRow {
  player: FantraxPlayer | null;
  pos: FantraxPosition | null;
  pos_id?: string;
  fppg?: number;
}

export interface FantraxRoster {
  team_id: string;
  rows: FantraxRosterRow[];
}

export interface FantraxLeague {
  league_id: string;
  name: string;
  sport: string;
}

export interface FantraxAPIConfig {
  leagueId: string;
  baseUrl?: string;
  cookie?: string;
}
