// CRITICAL: Load environment variables FIRST using require (synchronous)
// This must happen before ANY imports that might use DATABASE_URL
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Now import db after env vars are loaded
import { db } from '../lib/db';
import { teams, players, games } from '../lib/db/schema';

// NHL Teams Data
const nhlTeams = [
  { id: 'ana', name: 'Anaheim Ducks', abbreviation: 'ANA', conference: 'Western', division: 'Pacific' },
  { id: 'ari', name: 'Arizona Coyotes', abbreviation: 'ARI', conference: 'Western', division: 'Central' },
  { id: 'bos', name: 'Boston Bruins', abbreviation: 'BOS', conference: 'Eastern', division: 'Atlantic' },
  { id: 'buf', name: 'Buffalo Sabres', abbreviation: 'BUF', conference: 'Eastern', division: 'Atlantic' },
  { id: 'cgy', name: 'Calgary Flames', abbreviation: 'CGY', conference: 'Western', division: 'Pacific' },
  { id: 'car', name: 'Carolina Hurricanes', abbreviation: 'CAR', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'chi', name: 'Chicago Blackhawks', abbreviation: 'CHI', conference: 'Western', division: 'Central' },
  { id: 'col', name: 'Colorado Avalanche', abbreviation: 'COL', conference: 'Western', division: 'Central' },
  { id: 'cbj', name: 'Columbus Blue Jackets', abbreviation: 'CBJ', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'dal', name: 'Dallas Stars', abbreviation: 'DAL', conference: 'Western', division: 'Central' },
  { id: 'det', name: 'Detroit Red Wings', abbreviation: 'DET', conference: 'Eastern', division: 'Atlantic' },
  { id: 'edm', name: 'Edmonton Oilers', abbreviation: 'EDM', conference: 'Western', division: 'Pacific' },
  { id: 'fla', name: 'Florida Panthers', abbreviation: 'FLA', conference: 'Eastern', division: 'Atlantic' },
  { id: 'lak', name: 'Los Angeles Kings', abbreviation: 'LAK', conference: 'Western', division: 'Pacific' },
  { id: 'min', name: 'Minnesota Wild', abbreviation: 'MIN', conference: 'Western', division: 'Central' },
  { id: 'mtl', name: 'Montreal Canadiens', abbreviation: 'MTL', conference: 'Eastern', division: 'Atlantic' },
  { id: 'nsh', name: 'Nashville Predators', abbreviation: 'NSH', conference: 'Western', division: 'Central' },
  { id: 'njd', name: 'New Jersey Devils', abbreviation: 'NJD', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'nyi', name: 'New York Islanders', abbreviation: 'NYI', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'nyr', name: 'New York Rangers', abbreviation: 'NYR', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'ott', name: 'Ottawa Senators', abbreviation: 'OTT', conference: 'Eastern', division: 'Atlantic' },
  { id: 'phi', name: 'Philadelphia Flyers', abbreviation: 'PHI', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'pit', name: 'Pittsburgh Penguins', abbreviation: 'PIT', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'sjs', name: 'San Jose Sharks', abbreviation: 'SJS', conference: 'Western', division: 'Pacific' },
  { id: 'sea', name: 'Seattle Kraken', abbreviation: 'SEA', conference: 'Western', division: 'Pacific' },
  { id: 'stl', name: 'St. Louis Blues', abbreviation: 'STL', conference: 'Western', division: 'Central' },
  { id: 'tbl', name: 'Tampa Bay Lightning', abbreviation: 'TBL', conference: 'Eastern', division: 'Atlantic' },
  { id: 'tor', name: 'Toronto Maple Leafs', abbreviation: 'TOR', conference: 'Eastern', division: 'Atlantic' },
  { id: 'van', name: 'Vancouver Canucks', abbreviation: 'VAN', conference: 'Western', division: 'Pacific' },
  { id: 'vgk', name: 'Vegas Golden Knights', abbreviation: 'VGK', conference: 'Western', division: 'Pacific' },
  { id: 'wsh', name: 'Washington Capitals', abbreviation: 'WSH', conference: 'Eastern', division: 'Metropolitan' },
  { id: 'wpg', name: 'Winnipeg Jets', abbreviation: 'WPG', conference: 'Western', division: 'Central' },
];

// Sample Players Data with dateOfBirth
const samplePlayers = [
  // Forwards - Top scorers
  { id: 'p1', name: 'Auston Matthews', teamId: 'tor', position: 'C' as const, jerseyNumber: 34, dateOfBirth: new Date('1997-09-17'), goals: 69, assists: 38, points: 107, plusMinus: 20, status: 'healthy' as const },
  { id: 'p2', name: 'David Pastrnak', teamId: 'bos', position: 'RW' as const, jerseyNumber: 10, dateOfBirth: new Date('1996-05-25'), goals: 47, assists: 63, points: 110, plusMinus: 10, status: 'healthy' as const },
  { id: 'p3', name: 'Nathan MacKinnon', teamId: 'col', position: 'C' as const, jerseyNumber: 29, dateOfBirth: new Date('1995-09-01'), goals: 51, assists: 89, points: 140, plusMinus: 15, status: 'healthy' as const },
  { id: 'p4', name: 'Leon Draisaitl', teamId: 'edm', position: 'C' as const, jerseyNumber: 29, dateOfBirth: new Date('1995-10-27'), goals: 41, assists: 65, points: 106, plusMinus: 5, status: 'healthy' as const },
  { id: 'p5', name: 'Nikita Kucherov', teamId: 'tbl', position: 'RW' as const, jerseyNumber: 86, dateOfBirth: new Date('1993-06-17'), goals: 44, assists: 100, points: 144, plusMinus: 8, status: 'healthy' as const },
  { id: 'p6', name: 'Elias Pettersson', teamId: 'van', position: 'C' as const, jerseyNumber: 40, dateOfBirth: new Date('1998-11-12'), goals: 34, assists: 55, points: 89, plusMinus: 12, status: 'questionable' as const },
  { id: 'p7', name: 'Artemi Panarin', teamId: 'nyr', position: 'LW' as const, jerseyNumber: 10, dateOfBirth: new Date('1991-10-30'), goals: 49, assists: 71, points: 120, plusMinus: 18, status: 'healthy' as const },
  { id: 'p8', name: 'Jason Robertson', teamId: 'dal', position: 'LW' as const, jerseyNumber: 21, dateOfBirth: new Date('1999-07-22'), goals: 29, assists: 51, points: 80, plusMinus: -5, status: 'injured' as const },
  // Defensemen
  { id: 'p9', name: 'Cale Makar', teamId: 'col', position: 'D' as const, jerseyNumber: 8, dateOfBirth: new Date('1998-10-30'), goals: 21, assists: 69, points: 90, plusMinus: 30, status: 'healthy' as const },
  { id: 'p10', name: 'Victor Hedman', teamId: 'tbl', position: 'D' as const, jerseyNumber: 77, dateOfBirth: new Date('1990-12-18'), goals: 13, assists: 63, points: 76, plusMinus: 10, status: 'healthy' as const },
  { id: 'p11', name: 'Quinn Hughes', teamId: 'van', position: 'D' as const, jerseyNumber: 43, dateOfBirth: new Date('1999-10-14'), goals: 17, assists: 75, points: 92, plusMinus: 38, status: 'healthy' as const },
  // Goalies
  { id: 'p12', name: 'Igor Shesterkin', teamId: 'nyr', position: 'G' as const, jerseyNumber: 31, dateOfBirth: new Date('1995-12-30'), wins: 36, losses: 17, shutouts: 4, savePercentage: 912, status: 'healthy' as const },
  { id: 'p13', name: 'Jeremy Swayman', teamId: 'bos', position: 'G' as const, jerseyNumber: 1, dateOfBirth: new Date('1998-11-24'), wins: 25, losses: 10, shutouts: 3, savePercentage: 916, status: 'healthy' as const },
  { id: 'p14', name: 'Jake Oettinger', teamId: 'dal', position: 'G' as const, jerseyNumber: 29, dateOfBirth: new Date('1998-12-18'), wins: 35, losses: 14, shutouts: 5, savePercentage: 905, status: 'questionable' as const },
];

async function seed() {
  console.log('Starting seed...');
  console.log('DATABASE_URL check:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

  if (!db) {
    console.error('Database not configured. Please set DATABASE_URL in your .env file.');
    process.exit(1);
  }

  try {
    // Clear existing data (optional, for fresh seeds)
    console.log('Clearing existing data...');
    await db.delete(games);
    await db.delete(players);
    await db.delete(teams);

    // Seed Teams
    console.log('Seeding teams...');
    await db.insert(teams).values(nhlTeams);
    console.log(`✓ Seeded ${nhlTeams.length} teams.`);

    // Seed Players
    console.log('Seeding players...');
    await db.insert(players).values(samplePlayers);
    console.log(`✓ Seeded ${samplePlayers.length} players.`);

    // Seed Games (dummy schedule data)
    console.log('Seeding games...');
    const today = new Date();
    today.setHours(19, 0, 0, 0); // 7 PM today
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    
    const sampleGames = [
      // Games today (next slate)
      { id: 'g1', homeTeamId: 'tor', awayTeamId: 'bos', gameDate: today, status: 'scheduled' as const },
      { id: 'g2', homeTeamId: 'nyr', awayTeamId: 'col', gameDate: new Date(today.getTime() + 2 * 60 * 60 * 1000), status: 'scheduled' as const }, // 9 PM
      { id: 'g3', homeTeamId: 'edm', awayTeamId: 'van', gameDate: new Date(today.getTime() + 3 * 60 * 60 * 1000), status: 'scheduled' as const }, // 10 PM
      
      // Games tomorrow (next slate)
      { id: 'g4', homeTeamId: 'dal', awayTeamId: 'tbl', gameDate: tomorrow, status: 'scheduled' as const },
      { id: 'g5', homeTeamId: 'bos', awayTeamId: 'nyr', gameDate: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), status: 'scheduled' as const },
      
      // Games day after (not in next slate)
      { id: 'g6', homeTeamId: 'col', awayTeamId: 'edm', gameDate: dayAfter, status: 'scheduled' as const },
      { id: 'g7', homeTeamId: 'van', awayTeamId: 'tor', gameDate: new Date(dayAfter.getTime() + 2 * 60 * 60 * 1000), status: 'scheduled' as const },
    ];
    
    await db.insert(games).values(sampleGames);
    console.log(`✓ Seeded ${sampleGames.length} games.`);

    console.log('✅ Seed complete!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    if (db && (db as any).session?.client) {
      await (db as any).session.client.end();
    }
    process.exit(0);
  }
}

seed();
