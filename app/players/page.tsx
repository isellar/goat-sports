'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import PlayerCard from '@/components/ui-elements/PlayerCard';
import type { Player, Team } from '@/lib/db/schema';

interface PlayerWithTeam extends Player {
  team: Team | null;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerWithTeam[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('all');
  const [teamId, setTeamId] = useState('all');
  const [minPoints, setMinPoints] = useState('');
  const [minGoals, setMinGoals] = useState('');
  const [sortBy, setSortBy] = useState('name');
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
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);

    fetch(`/api/players?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching players:', err);
        setLoading(false);
      });
  }, [search, position, teamId, minPoints, minGoals, sortBy, sortOrder]);

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

            {/* Second Row: Stats Filters and Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              {/* Sort By */}
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sortBy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="goals">Goals</SelectItem>
                    <SelectItem value="assists">Assists</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Order</Label>
                <Button
                  id="sortOrder"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading players...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No players found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              team={player.team?.abbreviation || 'N/A'}
              position={player.position}
              number={player.jerseyNumber?.toString()}
              stats={{
                goals: player.goals || 0,
                assists: player.assists || 0,
                points: player.points || 0,
                plusMinus: player.plusMinus || 0,
                wins: player.wins || 0,
                losses: player.losses || 0,
                shutouts: player.shutouts || 0,
                savePercentage: player.savePercentage
                  ? player.savePercentage / 1000
                  : undefined,
              }}
              status={player.status as 'healthy' | 'questionable' | 'injured' | 'out'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

