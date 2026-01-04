'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SortableTableHead } from '@/components/players/SortableTableHead';
import { PlayerTableRow } from '@/components/players/PlayerTableRow';
import { calculateFantasyPoints } from '@/lib/utils/fantasy';
import type { Player, Team, Game } from '@/lib/db/schema';

interface PlayerWithTeamAndNextGame extends Player {
  team: Team | null;
  nextGame: (Game & { homeTeam: Team; awayTeam: Team }) | null;
}

type SortField =
  | 'name'
  | 'points'
  | 'goals'
  | 'assists'
  | 'plusMinus'
  | 'position'
  | 'team'
  | 'fantasyPoints';

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerWithTeamAndNextGame[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('all');
  const [teamId, setTeamId] = useState('all');
  const [minPoints, setMinPoints] = useState('');
  const [minGoals, setMinGoals] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch teams on mount
  useEffect(() => {
    fetch('/api/teams')
      .then((res) => res.json())
      .then((data) => setTeams(data.teams || []))
      .catch((err) => console.error('Error fetching teams:', err));
  }, []);

  // Fetch players when filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (position !== 'all') params.set('position', position);
    if (teamId !== 'all') params.set('teamId', teamId);
    if (minPoints) params.set('minPoints', minPoints);
    if (minGoals) params.set('minGoals', minGoals);
    
    // Only send sortBy to API if it's a database field
    // Fantasy points will be sorted client-side
    if (sortBy !== 'fantasyPoints') {
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
    }

    fetch(`/api/players?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Players data received:', data);
        let sortedPlayers = data.players || [];
        console.log('Number of players:', sortedPlayers.length);
        
        // Client-side sorting for fantasy points
        if (sortBy === 'fantasyPoints') {
          sortedPlayers = [...sortedPlayers].sort((a, b) => {
            const fpA = calculateFantasyPoints(a);
            const fpB = calculateFantasyPoints(b);
            return sortOrder === 'asc' ? fpA - fpB : fpB - fpA;
          });
        }
        
        setPlayers(sortedPlayers);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching players:', err);
        setLoading(false);
        setPlayers([]);
      });
  }, [search, position, teamId, minPoints, minGoals, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field as SortField);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'questionable':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'injured':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400';
      case 'out':
        return 'bg-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">NHL Players</h1>
        <p className="text-muted-foreground">
          Browse and search NHL players for your fantasy team
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* First Row: Search and Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Position Filter */}
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="C">Center</SelectItem>
                  <SelectItem value="LW">Left Wing</SelectItem>
                  <SelectItem value="RW">Right Wing</SelectItem>
                  <SelectItem value="D">Defenseman</SelectItem>
                  <SelectItem value="G">Goalie</SelectItem>
                </SelectContent>
              </Select>

              {/* Team Filter */}
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Second Row: Stats Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Min Points */}
              <div className="space-y-2">
                <Label htmlFor="minPoints">Min Points</Label>
                <Input
                  id="minPoints"
                  type="number"
                  placeholder="0"
                  value={minPoints}
                  onChange={(e) => setMinPoints(e.target.value)}
                />
              </div>

              {/* Min Goals */}
              <div className="space-y-2">
                <Label htmlFor="minGoals">Min Goals</Label>
                <Input
                  id="minGoals"
                  type="number"
                  placeholder="0"
                  value={minGoals}
                  onChange={(e) => setMinGoals(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading players...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No players found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* Player Card - consolidates Name, Position, Team, Age, Status */}
                    <SortableTableHead
                      field="name"
                      currentSort={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    >
                      Player
                    </SortableTableHead>
                    <TableHead>Opp</TableHead>
                    <TableHead className="text-right">GP</TableHead>
                    <SortableTableHead
                      field="fantasyPoints"
                      currentSort={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="text-right"
                    >
                      FPts
                    </SortableTableHead>
                    <TableHead className="text-right">FP/G</TableHead>
                    <TableHead className="text-right">Pos Rank</TableHead>
                    <TableHead className="text-right">Pos Rank L10</TableHead>
                    <TableHead className="text-center">Heat</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                    <TableHead className="text-center w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => (
                    <PlayerTableRow
                      key={player.id}
                      player={player}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
