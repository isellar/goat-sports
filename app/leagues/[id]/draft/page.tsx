'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Play, Clock, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import Link from 'next/link';
import { PlayerCard } from '@/components/players/PlayerCard';
import { cn } from '@/lib/utils';
import type { Draft, DraftPick, Player, Team, FantasyTeam } from '@/lib/db/schema';

interface DraftPickWithDetails extends DraftPick {
  player: Player & { team: Team | null };
  fantasyTeam: FantasyTeam;
}

interface DraftData {
  draft: Draft & { currentTeam: FantasyTeam | null };
  picks: DraftPickWithDetails[];
}

// TODO: Replace with actual auth user ID
const CURRENT_USER_ID = 'user_test_1';

export default function DraftPage() {
  const params = useParams();
  const leagueId = params.id as string;

  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [pickTimeLimit, setPickTimeLimit] = useState('60');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Player & { team: Team | null })[]>([]);
  const [searching, setSearching] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  // Fetch draft data
  useEffect(() => {
    if (!leagueId) return;

    const fetchDraft = async () => {
      try {
        // First check if draft exists
        const draftResponse = await fetch(`/api/leagues/${leagueId}/draft`);
        if (draftResponse.ok) {
          const { draft } = await draftResponse.json();
          if (draft) {
            // Fetch full draft data
            const fullResponse = await fetch(`/api/drafts/${draft.id}`);
            if (fullResponse.ok) {
              const data = await fullResponse.json();
              setDraftData(data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching draft:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
    
    // Poll for updates if draft is in progress
    const interval = setInterval(() => {
      if (draftData?.draft.status === 'in_progress') {
        fetchDraft();
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [leagueId, draftData?.draft.status]);

  const handleStartDraft = async () => {
    try {
      const response = await fetch(`/api/leagues/${leagueId}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickTimeLimit: pickTimeLimit ? parseInt(pickTimeLimit) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start draft');
      }

      const { draft } = await response.json();
      
      // Start the draft
      await fetch(`/api/drafts/${draft.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      });

      setIsStartDialogOpen(false);
      // Refresh draft data
      window.location.reload();
    } catch (error) {
      console.error('Error starting draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to start draft');
    }
  };

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

  const handleMakePick = async (playerId: string) => {
    if (!draftData?.draft.id) return;

    setIsPicking(true);
    try {
      const response = await fetch(`/api/drafts/${draftData.draft.id}/pick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to make pick');
      }

      // Refresh draft data
      const fullResponse = await fetch(`/api/drafts/${draftData.draft.id}`);
      if (fullResponse.ok) {
        const data = await fullResponse.json();
        setDraftData(data);
      }

      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error making pick:', error);
      alert(error instanceof Error ? error.message : 'Failed to make pick');
    } finally {
      setIsPicking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'in_progress':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'completed':
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  const isMyTurn = draftData?.draft.currentTeam?.ownerId === CURRENT_USER_ID;
  const draftOrder: string[] = draftData?.draft.draftOrder 
    ? JSON.parse(draftData.draft.draftOrder) 
    : [];

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading draft...</p>
        </div>
      </div>
    );
  }

  if (!draftData) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/leagues/${leagueId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold">Draft</h1>
            <p className="text-muted-foreground">No draft found for this league</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start Draft</CardTitle>
            <CardDescription>
              Create and start a draft for this league
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Create Draft
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start Draft</DialogTitle>
                  <DialogDescription>
                    Configure draft settings and start the draft
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickTimeLimit">Pick Time Limit (seconds, optional)</Label>
                    <Input
                      id="pickTimeLimit"
                      type="number"
                      placeholder="60"
                      value={pickTimeLimit}
                      onChange={(e) => setPickTimeLimit(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty for no time limit
                    </p>
                  </div>
                  <Button onClick={handleStartDraft} className="w-full">
                    Start Draft
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">Draft</h1>
              <Badge className={getStatusColor(draftData.draft.status || 'scheduled')}>
                {draftData.draft.status || 'scheduled'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Pick #{draftData.draft.currentPick || 1} of {draftOrder.length}
            </p>
          </div>
        </div>
      </div>

      {draftData.draft.status === 'in_progress' && isMyTurn && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Your Turn to Pick!
            </CardTitle>
            <CardDescription>
              Select a player for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                <Button onClick={handleSearchPlayers} disabled={searching || isPicking}>
                  Search
                </Button>
              </div>
              {searching && (
                <p className="text-sm text-muted-foreground">Searching...</p>
              )}
              {searchResults.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto space-y-2 border rounded p-4">
                  {searchResults.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 border rounded hover:bg-accent"
                    >
                      <PlayerCard player={player} team={player.team} />
                      <Button
                        size="sm"
                        onClick={() => handleMakePick(player.id)}
                        disabled={isPicking}
                      >
                        {isPicking ? 'Picking...' : 'Pick'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {draftData.draft.status === 'in_progress' && !isMyTurn && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              Waiting for {draftData.draft.currentTeam?.name || 'current team'} to pick...
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Draft Picks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {draftData.picks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No picks yet
              </p>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pick</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Player</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftData.picks.map((pick) => (
                      <TableRow key={pick.id}>
                        <TableCell className="font-medium">#{pick.pickNumber}</TableCell>
                        <TableCell>{pick.fantasyTeam.name}</TableCell>
                        <TableCell>
                          <PlayerCard player={pick.player} team={pick.player.team} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Draft Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {draftOrder.map((teamId, index) => {
                const team = draftData.picks.find((p) => p.fantasyTeam.id === teamId)?.fantasyTeam;
                const isCurrent = teamId === draftData.draft.currentTeamId;
                return (
                  <div
                    key={teamId}
                    className={cn(
                      'p-2 rounded border',
                      isCurrent && 'bg-primary/10 border-primary'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {index + 1}. {team?.name || `Team ${teamId.slice(0, 8)}`}
                      </span>
                      {isCurrent && (
                        <Badge variant="outline">Current</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
