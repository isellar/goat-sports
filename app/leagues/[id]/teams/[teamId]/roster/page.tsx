'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, X, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PlayerCard } from '@/components/players/PlayerCard';
import type { Roster, Player, Team, FantasyTeam } from '@/lib/db/schema';

interface RosterItem extends Roster {
  player: Player & { team: Team | null };
}

interface RosterData {
  team: FantasyTeam;
  roster: RosterItem[];
}

const LINEUP_POSITIONS = [
  { value: 'C', label: 'Center' },
  { value: 'LW', label: 'Left Wing' },
  { value: 'RW', label: 'Right Wing' },
  { value: 'D', label: 'Defenseman' },
  { value: 'G', label: 'Goalie' },
  { value: 'BN', label: 'Bench' },
  { value: 'IR', label: 'IR' },
];

export default function RosterPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  const leagueId = params.id as string; // This is the league ID from the URL path

  const [rosterData, setRosterData] = useState<RosterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Player & { team: Team | null })[]>([]);
  const [searching, setSearching] = useState(false);

  // Fetch roster
  useEffect(() => {
    if (!teamId) return;

    setLoading(true);
    fetch(`/api/fantasy-teams/${teamId}/roster`)
      .then((res) => res.json())
      .then((data) => {
        setRosterData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching roster:', err);
        setLoading(false);
      });
  }, [teamId]);

  const handleSearchPlayers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`/api/players?search=${encodeURIComponent(searchQuery)}&limit=20`);
      const data = await response.json();
      setSearchResults(data.players || []);
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddPlayer = async (playerId: string) => {
    try {
      const response = await fetch(`/api/fantasy-teams/${teamId}/roster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          lineupPosition: 'BN', // Default to bench
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add player');
      }

      // Refresh roster
      const rosterResponse = await fetch(`/api/fantasy-teams/${teamId}/roster`);
      const rosterData = await rosterResponse.json();
      setRosterData(rosterData);

      setIsAddDialogOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding player:', error);
      alert(error instanceof Error ? error.message : 'Failed to add player');
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (!confirm('Remove this player from your roster?')) return;

    try {
      const response = await fetch(`/api/fantasy-teams/${teamId}/roster/${playerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove player');
      }

      // Refresh roster
      const rosterResponse = await fetch(`/api/fantasy-teams/${teamId}/roster`);
      const rosterData = await rosterResponse.json();
      setRosterData(rosterData);
    } catch (error) {
      console.error('Error removing player:', error);
      alert(error instanceof Error ? error.message : 'Failed to remove player');
    }
  };

  const handleUpdatePosition = async (playerId: string, newPosition: string) => {
    try {
      const response = await fetch(`/api/fantasy-teams/${teamId}/roster/${playerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineupPosition: newPosition }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update position');
      }

      // Refresh roster
      const rosterResponse = await fetch(`/api/fantasy-teams/${teamId}/roster`);
      const rosterData = await rosterResponse.json();
      setRosterData(rosterData);
    } catch (error) {
      console.error('Error updating position:', error);
      alert(error instanceof Error ? error.message : 'Failed to update position');
    }
  };

  const groupRosterByPosition = (roster: RosterItem[]) => {
    const grouped: Record<string, RosterItem[]> = {};
    LINEUP_POSITIONS.forEach((pos) => {
      grouped[pos.value] = [];
    });

    roster.forEach((item) => {
      const position = item.lineupPosition || 'BN';
      if (!grouped[position]) {
        grouped[position] = [];
      }
      grouped[position].push(item);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading roster...</p>
        </div>
      </div>
    );
  }

  if (!rosterData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Roster not found</p>
          <Link href={`/leagues/${leagueId}`}>
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to League
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const groupedRoster = groupRosterByPosition(rosterData.roster);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/leagues/${leagueId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold">{rosterData.team.name}</h1>
            <p className="text-muted-foreground">Roster Management</p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Player to Roster</DialogTitle>
              <DialogDescription>
                Search for a player to add to your roster
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchPlayers();
                    }
                  }}
                />
                <Button onClick={handleSearchPlayers} disabled={searching}>
                  Search
                </Button>
              </div>
              {searching && (
                <p className="text-sm text-muted-foreground">Searching...</p>
              )}
              {searchResults.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {searchResults.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 border rounded hover:bg-accent"
                    >
                      <PlayerCard player={player} team={player.team} />
                      <Button
                        size="sm"
                        onClick={() => handleAddPlayer(player.id)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {LINEUP_POSITIONS.map((position) => {
          const players = groupedRoster[position.value] || [];
          return (
            <Card key={position.value}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{position.label}</span>
                  <Badge variant="outline">{players.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {players.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No players
                  </p>
                ) : (
                  <div className="space-y-2">
                    {players.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1 min-w-0">
                          <PlayerCard
                            player={item.player}
                            team={item.player.team}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={item.lineupPosition || 'BN'}
                            onValueChange={(value) =>
                              handleUpdatePosition(item.playerId, value)
                            }
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LINEUP_POSITIONS.map((pos) => (
                                <SelectItem key={pos.value} value={pos.value}>
                                  {pos.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePlayer(item.playerId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
