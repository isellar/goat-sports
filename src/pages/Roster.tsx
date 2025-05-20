import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import the refactored components
import RosterTable from '@/components/roster/RosterTable';
import RosterCards from '@/components/roster/RosterCards';
import RosterByPosition from '@/components/roster/RosterByPosition';
import RosterSearch from '@/components/roster/RosterSearch';
import TeamStatsCards from '@/components/roster/TeamStatsCards';
import CollapsibleSection from '@/components/roster/CollapsibleSection';

// Mock player data with expanded statistics
const mockPlayers = [
  {
    id: 1,
    name: "Connor McDavid",
    team: "EDM",
    position: "C",
    number: "97",
    stats: { goals: 12, assists: 18, points: 30, plusMinus: 8, pim: 10, sog: 65, hits: 12, blocks: 5 },
    status: "healthy",
    nextGame: { opponent: "vs CGY", date: "Dec 5" }
  },
  {
    id: 2,
    name: "Leon Draisaitl",
    team: "EDM",
    position: "C",
    number: "29",
    stats: { goals: 9, assists: 16, points: 25, plusMinus: 5, pim: 8, sog: 55, hits: 15, blocks: 8 },
    status: "healthy",
    nextGame: { opponent: "vs CGY", date: "Dec 5" }
  },
  {
    id: 3,
    name: "Cale Makar",
    team: "COL",
    position: "D",
    number: "8",
    stats: { goals: 5, assists: 18, points: 23, plusMinus: 12, pim: 6, sog: 48, hits: 22, blocks: 32 },
    status: "healthy",
    nextGame: { opponent: "vs VGK", date: "Dec 6" }
  },
  {
    id: 4,
    name: "Auston Matthews",
    team: "TOR",
    position: "C",
    number: "34",
    stats: { goals: 15, assists: 9, points: 24, plusMinus: 4, pim: 4, sog: 72, hits: 18, blocks: 9 },
    status: "healthy",
    nextGame: { opponent: "vs MTL", date: "Dec 7" }
  },
  {
    id: 5,
    name: "Nathan MacKinnon",
    team: "COL",
    position: "C",
    number: "29",
    stats: { goals: 8, assists: 15, points: 23, plusMinus: 10, pim: 14, sog: 68, hits: 10, blocks: 5 },
    status: "healthy",
    nextGame: { opponent: "vs VGK", date: "Dec 6" }
  },
  {
    id: 6,
    name: "Victor Hedman",
    team: "TBL",
    position: "D",
    number: "77",
    stats: { goals: 3, assists: 12, points: 15, plusMinus: 2, pim: 12, sog: 45, hits: 24, blocks: 28 },
    status: "questionable",
    nextGame: { opponent: "vs NYR", date: "Dec 8" }
  },
  {
    id: 7,
    name: "Kirill Kaprizov",
    team: "MIN",
    position: "LW",
    number: "97",
    stats: { goals: 10, assists: 12, points: 22, plusMinus: 6, pim: 8, sog: 56, hits: 16, blocks: 4 },
    status: "healthy",
    nextGame: { opponent: "vs DAL", date: "Dec 6" }
  },
  {
    id: 8,
    name: "Igor Shesterkin",
    team: "NYR",
    position: "G",
    number: "31",
    stats: { wins: 10, losses: 3, shutouts: 2, savePercentage: 0.925, pim: 2 },
    status: "healthy",
    nextGame: { opponent: "at TBL", date: "Dec 8" }
  },
  {
    id: 9,
    name: "Adam Fox",
    team: "NYR",
    position: "D",
    number: "23",
    stats: { goals: 4, assists: 14, points: 18, plusMinus: 9 },
    status: "healthy",
    nextGame: { opponent: "at TBL", date: "Dec 8" }
  },
  {
    id: 10,
    name: "David Pastrnak",
    team: "BOS",
    position: "RW",
    number: "88",
    stats: { goals: 14, assists: 8, points: 22, plusMinus: 3 },
    status: "healthy",
    nextGame: { opponent: "vs PIT", date: "Dec 7" }
  },
  {
    id: 11,
    name: "Andrei Vasilevskiy",
    team: "TBL",
    position: "G",
    number: "88",
    stats: { wins: 8, losses: 4, shutouts: 1, savePercentage: 0.919 },
    status: "healthy",
    nextGame: { opponent: "vs NYR", date: "Dec 8" }
  },
  {
    id: 12,
    name: "Sidney Crosby",
    team: "PIT",
    position: "C",
    number: "87",
    stats: { goals: 8, assists: 14, points: 22, plusMinus: 5 },
    status: "healthy",
    nextGame: { opponent: "at BOS", date: "Dec 7" }
  }
];

// Group players by position
const getPlayersByPosition = () => {
  return {
    centers: mockPlayers.filter(p => p.position === "C"),
    wings: mockPlayers.filter(p => p.position === "LW" || p.position === "RW"),
    defensemen: mockPlayers.filter(p => p.position === "D"),
    goalies: mockPlayers.filter(p => p.position === "G"),
    bench: mockPlayers.slice(0, 3) // Just for demonstration
  };
};

const positionColors = {
  'C': 'bg-blue-100 text-blue-800 border-blue-200',
  'LW': 'bg-green-100 text-green-800 border-green-200',
  'RW': 'bg-green-100 text-green-800 border-green-200',
  'D': 'bg-red-100 text-red-800 border-red-200',
  'G': 'bg-purple-100 text-purple-800 border-purple-200',
};

const statusColors = {
  'healthy': 'bg-green-500',
  'questionable': 'bg-yellow-400',
  'injured': 'bg-amber-500',
  'out': 'bg-red-500',
};

const Roster = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'}>({ key: 'name', direction: 'ascending' });
  
  const playersByPosition = getPlayersByPosition();
  
  const filteredPlayers = mockPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'ascending' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortConfig.key === 'position') {
      return sortConfig.direction === 'ascending' 
        ? a.position.localeCompare(b.position)
        : b.position.localeCompare(a.position);
    }
    if (sortConfig.key === 'team') {
      return sortConfig.direction === 'ascending' 
        ? a.team.localeCompare(b.team)
        : b.team.localeCompare(a.team);
    }
    if (sortConfig.key === 'points' && a.stats && b.stats) {
      const aPoints = a.position === 'G' ? (a.stats.wins || 0) : (a.stats.points || 0);
      const bPoints = b.position === 'G' ? (b.stats.wins || 0) : (b.stats.points || 0);
      return sortConfig.direction === 'ascending' ? aPoints - bPoints : bPoints - aPoints;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getPositionClass = (position: string) => {
    for (const [pos, color] of Object.entries(positionColors)) {
      if (position.includes(pos)) {
        return color;
      }
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">Team Roster</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">Ice Crushers</h1>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="h-9">
              <Filter size={15} className="mr-1.5" /> Filter
            </Button>
            <Button size="sm" className="h-9 bg-hockey-blue hover:bg-hockey-dark-blue">
              <Plus size={15} className="mr-1.5" /> Add Player
            </Button>
          </div>
        </div>
        <p className="text-hockey-light-slate">
          Manage your roster, view player statistics, and make lineup changes.
        </p>
      </div>

      {/* Team statistics cards - moved to the top and made collapsible */}
      <CollapsibleSection title="Team Overview" defaultOpen={true}>
        <TeamStatsCards mockPlayers={mockPlayers} />
      </CollapsibleSection>

      {/* Main content area with improved layout */}
      <div className="w-full">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>My Team</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Cards View</TabsTrigger>
                <TabsTrigger value="positions">By Position</TabsTrigger>
              </TabsList>

              {/* Search input */}
              <div className="flex justify-between items-center mb-4">
                <RosterSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>

              {/* Table View */}
              <TabsContent value="table" className="space-y-4">
                <RosterTable 
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                  sortedPlayers={sortedPlayers}
                  getPositionClass={getPositionClass}
                  statusColors={statusColors}
                />
              </TabsContent>

              {/* Cards View */}
              <TabsContent value="cards" className="space-y-4">
                <RosterCards 
                  filteredPlayers={filteredPlayers} 
                  searchTerm={searchTerm}
                />
              </TabsContent>
              
              {/* By Position View */}
              <TabsContent value="positions" className="space-y-6">
                <RosterByPosition 
                  playersByPosition={playersByPosition}
                  getPositionClass={getPositionClass}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Roster;
