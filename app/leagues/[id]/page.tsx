'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Calendar, Settings, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import type { League, User, FantasyTeam } from '@/lib/db/schema';

interface LeagueDetails extends League {
  commissioner?: User;
  members?: (User & { joinedAt: Date })[];
  teams?: (FantasyTeam & { owner: User })[];
}

export default function LeagueDetailPage() {
  const params = useParams();
  const leagueId = params.id as string;
  const [league, setLeague] = useState<LeagueDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leagueId) return;
    
    setLoading(true);
    fetch(`/api/leagues/${leagueId}`)
      .then((res) => res.json())
      .then((data) => {
        setLeague(data.league);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching league:', err);
        setLoading(false);
      });
  }, [leagueId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading league...</p>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">League not found</p>
          <Link href="/leagues">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leagues
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center gap-4">
        <Link href="/leagues">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{league.name}</h1>
            <Badge className={getStatusColor(league.status || 'draft')}>
              {league.status || 'draft'}
            </Badge>
          </div>
          {league.description && (
            <p className="text-muted-foreground mt-2">{league.description}</p>
          )}
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{league.status || 'draft'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {league.teams?.length || 0} / {league.maxTeams}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft Type</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {league.draftType === 'snake' ? 'Snake' : 'Auction'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Roster Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{league.rosterSize}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Commissioner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {league.commissioner?.name || league.commissioner?.email || 'Unknown'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fantasy Teams</CardTitle>
              <CardDescription>
                All teams in this league
              </CardDescription>
            </CardHeader>
            <CardContent>
              {league.teams && league.teams.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {league.teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.owner?.name || team.owner?.email || 'Unknown'}</TableCell>
                        <TableCell>
                          {team.createdAt
                            ? new Date(team.createdAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Link href={`/leagues/${leagueId}/teams/${team.id}/roster`}>
                            <Button variant="outline" size="sm">
                              View Roster
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No teams yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>League Members</CardTitle>
              <CardDescription>
                All members of this league
              </CardDescription>
            </CardHeader>
            <CardContent>
              {league.members && league.members.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {league.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.name || 'Unknown'}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          {member.joinedAt
                            ? new Date(member.joinedAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No members yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft</CardTitle>
              <CardDescription>
                Manage the league draft
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/leagues/${leagueId}/draft`}>
                <Button>
                  <Trophy className="h-4 w-4 mr-2" />
                  Go to Draft Room
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>League Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Max Teams</p>
                <p className="text-sm text-muted-foreground">{league.maxTeams}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Roster Size</p>
                <p className="text-sm text-muted-foreground">{league.rosterSize}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Draft Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {league.draftType === 'snake' ? 'Snake Draft' : 'Auction Draft'}
                </p>
              </div>
              {league.draftDate && (
                <div>
                  <p className="text-sm font-medium mb-1">Draft Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(league.draftDate).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
