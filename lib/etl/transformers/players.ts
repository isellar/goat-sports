/**
 * Player Data Transformers
 * Transforms Fantrax player data into our database schema format
 */

import type { FantraxPlayer, FantraxRosterRow } from '../types/fantrax';
import type { players } from '@/lib/db/schema';

type PlayerInsert = typeof players.$inferInsert;

/**
 * Transform Fantrax player data to our database schema
 */
export function transformFantraxPlayerToSchema(
  fantraxPlayer: FantraxPlayer,
  rosterRow?: FantraxRosterRow
): Partial<PlayerInsert> {
  // Map Fantrax position to our position enum
  const position = mapFantraxPositionToSchema(fantraxPlayer.pos_short_name);

  // Determine status based on Fantrax flags
  let status: 'healthy' | 'questionable' | 'injured' | 'out' = 'healthy';
  if (fantraxPlayer.injured) {
    status = 'injured';
  } else if (fantraxPlayer.suspended) {
    status = 'out';
  }

  const player: Partial<PlayerInsert> = {
    id: `fantrax_${fantraxPlayer.id}`,
    name: fantraxPlayer.name || fantraxPlayer.short_name,
    position: position as any, // Cast to satisfy type check
    status,
    // Team ID would need to be mapped from NHL team name to our team IDs
    teamId: null, // Will be set by the loader after team mapping
    // Stats will be populated separately by stats transformer
  };

  return player;
}

/**
 * Map Fantrax position codes to our schema position enum
 */
export function mapFantraxPositionToSchema(
  fantraxPosition?: string
): 'C' | 'LW' | 'RW' | 'D' | 'G' {
  if (!fantraxPosition) return 'C';

  const pos = fantraxPosition.toUpperCase();

  // Handle multi-position players (take first position)
  if (pos.includes('/') || pos.includes(',')) {
    const positions = pos.split(/[\/,]/);
    return mapFantraxPositionToSchema(positions[0].trim());
  }

  // Map Fantrax positions to our schema
  switch (pos) {
    case 'C':
      return 'C';
    case 'LW':
    case 'L':
      return 'LW';
    case 'RW':
    case 'R':
      return 'RW';
    case 'D':
    case 'LD':
    case 'RD':
      return 'D';
    case 'G':
      return 'G';
    default:
      // Default to center for forwards, defenseman for D positions
      if (pos.includes('W')) return 'LW';
      if (pos.includes('D')) return 'D';
      return 'C';
  }
}

/**
 * Map NHL team name from Fantrax to our team ID
 */
export function mapNHLTeamNameToId(teamName?: string): string | null {
  if (!teamName) return null;

  // Mapping of common team name variations to our team IDs
  const teamMap: Record<string, string> = {
    // Full names
    'Toronto Maple Leafs': 'tor',
    'Boston Bruins': 'bos',
    'Colorado Avalanche': 'col',
    'Edmonton Oilers': 'edm',
    'Tampa Bay Lightning': 'tbl',
    'New York Rangers': 'nyr',
    'Dallas Stars': 'dal',
    'Vancouver Canucks': 'van',
    'Calgary Flames': 'cgy',
    'Florida Panthers': 'fla',
    'Carolina Hurricanes': 'car',
    'Vegas Golden Knights': 'vgk',
    'Seattle Kraken': 'sea',
    'New York Islanders': 'nyi',
    'Pittsburgh Penguins': 'pit',
    'Washington Capitals': 'wsh',
    'Minnesota Wild': 'min',
    'Winnipeg Jets': 'wpg',
    'Nashville Predators': 'nsh',
    'St. Louis Blues': 'stl',
    'Los Angeles Kings': 'lak',
    'San Jose Sharks': 'sjs',
    'Anaheim Ducks': 'ana',
    'Arizona Coyotes': 'ari',
    'Chicago Blackhawks': 'chi',
    'Montreal Canadiens': 'mtl',
    'Ottawa Senators': 'ott',
    'Buffalo Sabres': 'buf',
    'Detroit Red Wings': 'det',
    'Columbus Blue Jackets': 'cbj',
    'New Jersey Devils': 'njd',
    'Philadelphia Flyers': 'phi',
    // Abbreviations
    TOR: 'tor',
    BOS: 'bos',
    COL: 'col',
    EDM: 'edm',
    TBL: 'tbl',
    NYR: 'nyr',
    DAL: 'dal',
    VAN: 'van',
    CGY: 'cgy',
    FLA: 'fla',
    CAR: 'car',
    VGK: 'vgk',
    SEA: 'sea',
    NYI: 'nyi',
    PIT: 'pit',
    WSH: 'wsh',
    MIN: 'min',
    WPG: 'wpg',
    NSH: 'nsh',
    STL: 'stl',
    LAK: 'lak',
    SJS: 'sjs',
    ANA: 'ana',
    ARI: 'ari',
    CHI: 'chi',
    MTL: 'mtl',
    OTT: 'ott',
    BUF: 'buf',
    DET: 'det',
    CBJ: 'cbj',
    NJD: 'njd',
    PHI: 'phi',
  };

  // Try exact match first
  if (teamMap[teamName]) {
    return teamMap[teamName];
  }

  // Try case-insensitive match
  const teamKey = Object.keys(teamMap).find(
    (key) => key.toLowerCase() === teamName.toLowerCase()
  );

  return teamKey ? teamMap[teamKey] : null;
}
