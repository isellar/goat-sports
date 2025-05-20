
import React, { useState } from 'react';
import { Users, Filter, Calendar, Search, Sliders, Plus, BarChart3, ShieldAlert } from 'lucide-react';
import PlayerCard from '@/components/ui-elements/PlayerCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Mock player data
const mockPlayers = [
  {
    id: 1,
    name: "Mikko Rantanen",
    team: "COL",
    position: "RW",
    number: "96",
    stats: { goals: 11, assists: 17, points: 28, plusMinus: 7 },
    status: "healthy",
    nextGame: { opponent: "vs VGK", date: "Dec 6" },
    available: true,
    owner: null,
    nextStart: null
  },
  {
    id: 2,
    name: "Brad Marchand",
    team: "BOS",
    position: "LW",
    number: "63",
    stats: { goals: 8, assists: 14, points: 22, plusMinus: 9 },
    status: "healthy",
    nextGame: { opponent: "vs PIT", date: "Dec 7" },
    available: true,
    owner: null,
    nextStart: null
  },
  {
    id: 3,
    name: "Igor Shesterkin",
    team: "NYR",
    position: "G",
    number: "31",
    stats: { wins: 10, losses: 4, shutouts: 2, savePercentage: .923 },
    status: "healthy",
    nextGame: { opponent: "at TBL", date: "Dec 8" },
    available: true,
    owner: null,
    nextStart: "Dec 5 vs CHI"
  },
  {
    id: 4,
    name: "Connor McDavid",
    team: "EDM",
    position: "C",
    number: "97",
    stats: { goals: 12, assists: 18, points: 30, plusMinus: 8 },
    status: "healthy",
    nextGame: { opponent: "vs CGY", date: "Dec 5" },
    available: false,
    owner: "Ice Crushers",
    nextStart: null
  },
  {
    id: 5,
    name: "Leon Draisaitl",
    team: "EDM",
    position: "C",
    number: "29",
    stats: { goals: 9, assists: 16, points: 25, plusMinus: 5 },
    status: "healthy",
    nextGame: { opponent: "vs CGY", date: "Dec 5" },
    available: false,
    owner: "Ice Crushers",
    nextStart: null
  },
  {
    id: 6,
    name: "Jake Oettinger",
    team: "DAL",
    position: "G",
    number: "29",
    stats: { wins: 9, losses: 5, shutouts: 1, savePercentage: .916 },
    status: "healthy",
    nextGame: { opponent: "vs MIN", date: "Dec 6" },
    available: true,
    owner: null,
    nextStart: "Dec 6 vs MIN"
  },
  {
    id: 7,
    name: "Thatcher Demko",
    team: "VAN",
    position: "G",
    number: "35",
    stats: { wins: 11, losses: 3, shutouts: 3, savePercentage: .929 },
    status: "healthy",
    nextGame: { opponent: "at ANA", date: "Dec 7" },
    available: false,
    owner: "Frozen Blades",
    nextStart: "Dec 7 at ANA"
  },
  {
    id: 8,
    name: "Victor Hedman",
    team: "TBL",
    position: "D",
    number: "77",
    stats: { goals: 3, assists: 12, points: 15, plusMinus: 2 },
    status: "questionable",
    nextGame: { opponent: "vs NYR", date: "Dec 8" },
    available: false,
    owner: "Ice Crushers",
    nextStart: null
  }
];

// NHL teams
const nhlTeams = [
  { id: "ANA", name: "Anaheim Ducks" },
  { id: "ARI", name: "Arizona Coyotes" },
  { id: "BOS", name: "Boston Bruins" },
  { id: "BUF", name: "Buffalo Sabres" },
  { id: "CGY", name: "Calgary Flames" },
  { id: "CAR", name: "Carolina Hurricanes" },
  { id: "CHI", name: "Chicago Blackhawks" },
  { id: "COL", name: "Colorado Avalanche" },
  { id: "CBJ", name: "Columbus Blue Jackets" },
  { id: "DAL", name: "Dallas Stars" },
  { id: "DET", name: "Detroit Red Wings" },
  { id: "EDM", name: "Edmonton Oilers" },
  { id: "FLA", name: "Florida Panthers" },
  { id: "LAK", name: "Los Angeles Kings" },
  { id: "MIN", name: "Minnesota Wild" },
  { id: "MTL", name: "Montreal Canadiens" },
  { id: "NSH", name: "Nashville Predators" },
  { id: "NJD", name: "New Jersey Devils" },
  { id: "NYI", name: "New York Islanders" },
  { id: "NYR", name: "New York Rangers" },
  { id: "OTT", name: "Ottawa Senators" },
  { id: "PHI", name: "Philadelphia Flyers" },
  { id: "PIT", name: "Pittsburgh Penguins" },
  { id: "SJS", name: "San Jose Sharks" },
  { id: "SEA", name: "Seattle Kraken" },
  { id: "STL", name: "St. Louis Blues" },
  { id: "TBL", name: "Tampa Bay Lightning" },
  { id: "TOR", name: "Toronto Maple Leafs" },
  { id: "VAN", name: "Vancouver Canucks" },
  { id: "VGK", name: "Vegas Golden Knights" },
  { id: "WSH", name: "Washington Capitals" },
  { id: "WPG", name: "Winnipeg Jets" }
];

// Game dates for the week
const gameDates = [
  { date: "2023-12-04", day: "Monday", games: 5 },
  { date: "2023-12-05", day: "Tuesday", games: 8 },
  { date: "2023-12-06", day: "Wednesday", games: 6 },
  { date: "2023-12-07", day: "Thursday", games: 9 },
  { date: "2023-12-08", day: "Friday", games: 7 },
  { date: "2023-12-09", day: "Saturday", games: 12 },
  { date: "2023-12-10", day: "Sunday", games: 4 }
];

const Players = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState('standard');
  
  // Filter players based on all criteria
  const filteredPlayers = mockPlayers.filter(player => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Position filter
    const matchesPosition = 
      positionFilter === 'all' || 
      player.position === positionFilter ||
      (positionFilter === 'F' && ['C', 'LW', 'RW'].includes(player.position));
    
    // Team filter
    const matchesTeam = teamFilter === 'all' || player.team === teamFilter;
    
    // Availability filter
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && player.available) ||
      (availabilityFilter === 'owned' && !player.available);

    // Date filter - this would need real data linking players to game schedules
    // For now, just use the mockup data to simulate
    const matchesDate = !selectedDate || (player.nextGame && player.nextGame.date === format(selectedDate, 'MMM d'));
    
    return matchesSearch && matchesPosition && matchesTeam && matchesAvailability && matchesDate;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">Player Pool</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">Players</h1>
          <div className="flex items-center gap-3">
            <Button size="sm" className="h-9 bg-hockey-blue hover:bg-hockey-dark-blue">
              <Plus size={15} className="mr-1.5" /> Add Player
            </Button>
          </div>
        </div>
        <p className="text-hockey-light-slate max-w-2xl">
          Browse available players, view statistics, and add them to your roster.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <DashboardCard 
            title="Filters" 
            icon={<Filter size={20} />}
            className="sticky top-6"
          >
            <div className="space-y-5 py-2">
              {/* Position Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">Position</label>
                <RadioGroup 
                  value={positionFilter} 
                  onValueChange={setPositionFilter}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <label htmlFor="all" className="text-sm">All</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="forwards" />
                    <label htmlFor="forwards" className="text-sm">Forwards</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="C" id="centers" />
                    <label htmlFor="centers" className="text-sm">Centers</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="LW" id="lw" />
                    <label htmlFor="lw" className="text-sm">Left Wing</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="RW" id="rw" />
                    <label htmlFor="rw" className="text-sm">Right Wing</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="D" id="defense" />
                    <label htmlFor="defense" className="text-sm">Defensemen</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="G" id="goalies" />
                    <label htmlFor="goalies" className="text-sm">Goalies</label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Team Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">Team</label>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {nhlTeams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">Availability</label>
                <RadioGroup 
                  value={availabilityFilter} 
                  onValueChange={setAvailabilityFilter}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-availability" />
                    <label htmlFor="all-availability" className="text-sm">All</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="available" id="available" />
                    <label htmlFor="available" className="text-sm">Available</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owned" id="owned" />
                    <label htmlFor="owned" className="text-sm">Owned</label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Game Date Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">Game Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {selectedDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear Date
                  </Button>
                )}
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">View Mode</label>
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'standard' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('standard')}
                  >
                    Standard
                  </Button>
                  <Button 
                    variant={viewMode === 'table' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </Button>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        {/* Players List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hockey-light-slate" size={18} />
              <input
                type="text"
                placeholder="Search players..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-hockey-slate focus:outline-none focus:ring-2 focus:ring-hockey-blue/20 focus:border-hockey-blue/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-hockey-light-slate hidden md:inline-block">
                {filteredPlayers.length} players
              </span>
              <Button variant="outline" size="sm">
                <Sliders size={15} className="mr-1.5" /> Sort
              </Button>
            </div>
          </div>

          {viewMode === 'standard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => (
                  <PlayerCard 
                    key={player.id}
                    name={player.name}
                    team={player.team}
                    position={player.position}
                    number={player.number}
                    stats={player.stats}
                    status={player.status as any}
                    nextGame={player.nextGame}
                    available={player.available}
                    owner={player.owner}
                    nextStart={player.nextStart}
                  />
                ))
              ) : (
                <div className="col-span-2 p-8 text-center text-hockey-light-slate">
                  No players found matching your filters
                </div>
              )}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Pos</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">PTS</TableHead>
                    <TableHead className="hidden md:table-cell">Next Game</TableHead>
                    <TableHead className="text-right">Availability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map(player => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell>{player.team}</TableCell>
                        <TableCell>{player.position}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {player.status === 'questionable' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <ShieldAlert size={12} className="mr-1" /> Q
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Healthy
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {'points' in player.stats ? player.stats.points : '-'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {player.nextGame ? (
                            <span>{player.nextGame.date} {player.nextGame.opponent}</span>
                          ) : '-'}
                          {player.position === 'G' && player.nextStart && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              Starting: {player.nextStart}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {player.available ? (
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 h-auto">
                              <Plus size={16} />
                            </Button>
                          ) : (
                            <span className="text-xs text-hockey-light-slate">{player.owner}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No players found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Players;
