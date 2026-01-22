'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import type { League } from '@/lib/db/schema';

// TODO: Replace with actual auth user ID
const CURRENT_USER_ID = 'user_test_1';

interface LeagueWithDetails extends League {
  memberCount?: number;
  teamCount?: number;
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<LeagueWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinLeagueId, setJoinLeagueId] = useState('');
  const [joinTeamName, setJoinTeamName] = useState('');

  // Form state for creating league
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxTeams: 12,
    draftType: 'snake' as 'snake' | 'auction',
    rosterSize: 20,
  });

  // Fetch user's leagues
  useEffect(() => {
    setLoading(true);
    fetch(`/api/leagues?userId=${CURRENT_USER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setLeagues(data.leagues || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leagues:', err);
        setLoading(false);
      });
  }, []);

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/leagues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          commissionerId: CURRENT_USER_ID,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create league');
      }

      const data = await response.json();
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', maxTeams: 12, draftType: 'snake', rosterSize: 20 });
      
      // Refresh leagues list
      const refreshResponse = await fetch(`/api/leagues?userId=${CURRENT_USER_ID}`);
      const refreshData = await refreshResponse.json();
      setLeagues(refreshData.leagues || []);
    } catch (error) {
      console.error('Error creating league:', error);
      alert(error instanceof Error ? error.message : 'Failed to create league');
    }
  };

  const handleJoinLeague = async () => {
    if (!joinLeagueId) {
      alert('Please enter a league ID');
      return;
    }

    try {
      const response = await fetch(`/api/leagues/${joinLeagueId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: CURRENT_USER_ID,
          teamName: joinTeamName || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to join league');
      }

      setIsJoinDialogOpen(false);
      setJoinLeagueId('');
      setJoinTeamName('');
      
      // Refresh leagues list
      const refreshResponse = await fetch(`/api/leagues?userId=${CURRENT_USER_ID}`);
      const refreshData = await refreshResponse.json();
      setLeagues(refreshData.leagues || []);
    } catch (error) {
      console.error('Error joining league:', error);
      alert(error instanceof Error ? error.message : 'Failed to join league');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'active':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'completed':
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Leagues</h1>
          <p className="text-muted-foreground">
            Manage your fantasy hockey leagues
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Join League
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a League</DialogTitle>
                <DialogDescription>
                  Enter the league ID to join an existing league
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="leagueId">League ID</Label>
                  <Input
                    id="leagueId"
                    placeholder="league_..."
                    value={joinLeagueId}
                    onChange={(e) => setJoinLeagueId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name (optional)</Label>
                  <Input
                    id="teamName"
                    placeholder="My Team"
                    value={joinTeamName}
                    onChange={(e) => setJoinTeamName(e.target.value)}
                  />
                </div>
                <Button onClick={handleJoinLeague} className="w-full">
                  Join League
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create League
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New League</DialogTitle>
                <DialogDescription>
                  Set up a new fantasy hockey league
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateLeague} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">League Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTeams">Max Teams</Label>
                    <Input
                      id="maxTeams"
                      type="number"
                      min="2"
                      max="20"
                      value={formData.maxTeams}
                      onChange={(e) => setFormData({ ...formData, maxTeams: parseInt(e.target.value) || 12 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rosterSize">Roster Size</Label>
                    <Input
                      id="rosterSize"
                      type="number"
                      min="10"
                      max="30"
                      value={formData.rosterSize}
                      onChange={(e) => setFormData({ ...formData, rosterSize: parseInt(e.target.value) || 20 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draftType">Draft Type</Label>
                  <Select
                    value={formData.draftType}
                    onValueChange={(value) => setFormData({ ...formData, draftType: value as 'snake' | 'auction' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="snake">Snake Draft</SelectItem>
                      <SelectItem value="auction">Auction Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create League
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading leagues...</p>
        </div>
      ) : leagues.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You're not in any leagues yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First League
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <Card key={league.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{league.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {league.description || 'No description'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(league.status || 'draft')}>
                    {league.status || 'draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{league.maxTeams} teams max</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{league.draftType === 'snake' ? 'Snake' : 'Auction'} Draft</span>
                  </div>
                  <div className="pt-2 border-t">
                    <Link href={`/leagues/${league.id}`}>
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        View League
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
