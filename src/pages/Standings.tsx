import React, { useState } from 'react';
import { Trophy, Users, Filter, ChevronDown, ChevronUp, BarChart3, CalendarClock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DashboardCard from '@/components/dashboard/DashboardCard';

// Mock team data
const teams = [
  { 
    id: 1, 
    name: 'Puck Masters', 
    abbr: 'PM',
    owner: 'Emily Johnson',
    record: { wins: 14, losses: 4, ties: 2 },
    points: 268,
    streakType: 'W',
    streakCount: 4,
    color: 'bg-purple-500'
  },
  { 
    id: 2, 
    name: 'Ice Crushers', 
    abbr: 'IC',
    owner: 'You',
    record: { wins: 12, losses: 6, ties: 2 },
    points: 237,
    streakType: 'W',
    streakCount: 2,
    color: 'bg-hockey-blue'
  },
  { 
    id: 3, 
    name: 'Slap Shots', 
    abbr: 'SS',
    owner: 'Michael Brown',
    record: { wins: 11, losses: 7, ties: 2 },
    points: 219,
    streakType: 'L',
    streakCount: 1,
    color: 'bg-blue-500'
  },
  { 
    id: 4, 
    name: 'Frozen Blades', 
    abbr: 'FB',
    owner: 'John Doe',
    record: { wins: 9, losses: 8, ties: 3 },
    points: 198,
    streakType: 'W',
    streakCount: 1,
    color: 'bg-hockey-red'
  },
  { 
    id: 5, 
    name: 'Puck Panthers', 
    abbr: 'PP',
    owner: 'Sarah Wilson',
    record: { wins: 9, losses: 9, ties: 2 },
    points: 193,
    streakType: 'L',
    streakCount: 2,
    color: 'bg-green-500'
  },
  { 
    id: 6, 
    name: 'Kings of the Rink', 
    abbr: 'KR',
    owner: 'David Martinez',
    record: { wins: 8, losses: 10, ties: 2 },
    points: 187,
    streakType: 'W',
    streakCount: 1,
    color: 'bg-purple-500'
  },
  { 
    id: 7, 
    name: 'Blue Line Defenders', 
    abbr: 'BD',
    owner: 'Jessica Taylor',
    record: { wins: 7, losses: 12, ties: 1 },
    points: 174,
    streakType: 'L',
    streakCount: 3,
    color: 'bg-blue-600'
  },
  { 
    id: 8, 
    name: 'Goal Getters', 
    abbr: 'GG',
    owner: 'Robert Anderson',
    record: { wins: 4, losses: 15, ties: 1 },
    points: 156,
    streakType: 'L',
    streakCount: 4,
    color: 'bg-amber-500'
  },
];

// Mock category leaders
const categoryLeaders = [
  { category: 'Goals', team: 'Puck Masters', value: 98 },
  { category: 'Assists', team: 'Ice Crushers', value: 156 },
  { category: 'Points', team: 'Puck Masters', value: 254 },
  { category: '+/-', team: 'Slap Shots', value: 42 },
  { category: 'PIM', team: 'Kings of the Rink', value: 187 },
  { category: 'PPG', team: 'Puck Masters', value: 32 },
  { category: 'SHG', team: 'Frozen Blades', value: 8 },
  { category: 'SOG', team: 'Ice Crushers', value: 768 },
  { category: 'Hits', team: 'Blue Line Defenders', value: 412 },
  { category: 'Blocks', team: 'Goal Getters', value: 298 },
];

// Sort functions
const sortByWins = (a: any, b: any) => b.record.wins - a.record.wins;
const sortByPoints = (a: any, b: any) => b.points - a.points;
const sortByName = (a: any, b: any) => a.name.localeCompare(b.name);

const Standings = () => {
  const [sortField, setSortField] = useState('wins');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getSortedTeams = () => {
    let sortedTeams = [...teams];
    
    switch (sortField) {
      case 'name':
        sortedTeams.sort(sortByName);
        break;
      case 'points':
        sortedTeams.sort(sortByPoints);
        break;
      case 'wins':
      default:
        sortedTeams.sort(sortByWins);
        break;
    }
    
    if (sortDirection === 'asc') {
      sortedTeams.reverse();
    }
    
    return sortedTeams;
  };
  
  const sortedTeams = getSortedTeams();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">League Standings</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Northern Ice Breakers</h1>
          <Button size="sm" variant="outline" className="h-9">
            <Filter size={15} className="mr-1.5" /> Filter
          </Button>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          View current league standings, team records, and statistical leaders.
        </p>
      </div>

      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="categories">Category Leaders</TabsTrigger>
          <TabsTrigger value="playoffs">Playoff Picture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standings">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-hockey-slate whitespace-nowrap">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                        Rank/Team
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-hockey-slate whitespace-nowrap">
                      <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('wins')}>
                        W
                        {sortField === 'wins' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-hockey-slate whitespace-nowrap">L</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-hockey-slate whitespace-nowrap">T</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-hockey-slate whitespace-nowrap">
                      <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('points')}>
                        PTS
                        {sortField === 'points' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-hockey-slate whitespace-nowrap">STREAK</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-hockey-slate whitespace-nowrap">OWNER</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((team, index) => (
                    <tr 
                      key={team.id} 
                      className={`border-b border-border ${team.abbr === 'IC' ? 'bg-hockey-blue/5' : 'bg-card'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 text-center font-medium text-hockey-light-slate mr-3">{index + 1}</div>
                          <div className={`w-8 h-8 rounded-md ${team.color} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                            {team.abbr}
                          </div>
                          <span className={`font-medium text-card-foreground`}>
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-card-foreground">{team.record.wins}</td>
                      <td className="px-4 py-3 text-center text-card-foreground">{team.record.losses}</td>
                      <td className="px-4 py-3 text-center text-card-foreground">{team.record.ties}</td>
                      <td className="px-4 py-3 text-center font-medium text-card-foreground">{team.points}</td>
                      <td className="px-4 py-3 text-center">
                        <span 
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            team.streakType === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {team.streakType}{team.streakCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-card-foreground">
                        {team.owner === 'You' ? (
                          <span className="font-medium text-hockey-blue">You</span>
                        ) : (
                          team.owner
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Your Team Standing" icon={<Trophy size={18} />}>
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hockey-blue/10 mb-3">
                  <span className="text-2xl font-bold text-hockey-blue">3</span>
                </div>
                <h3 className="text-lg font-semibold text-hockey-slate">Ice Crushers</h3>
                <p className="text-sm text-hockey-light-slate mt-1">12-6-2 Record</p>
                <div className="mt-3 font-medium text-hockey-blue">237 Total Points</div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Games Behind" icon={<BarChart3 size={18} />}>
              <div className="space-y-3 py-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <div className="flex-1 text-sm text-hockey-slate">Puck Masters</div>
                  <div className="font-medium text-hockey-slate">-</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-hockey-blue mr-2"></div>
                  <div className="flex-1 text-sm text-hockey-slate">Ice Crushers</div>
                  <div className="font-medium text-hockey-slate">2</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <div className="flex-1 text-sm text-hockey-slate">Slap Shots</div>
                  <div className="font-medium text-hockey-slate">3</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-hockey-red mr-2"></div>
                  <div className="flex-1 text-sm text-hockey-slate">Frozen Blades</div>
                  <div className="font-medium text-hockey-slate">5</div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Current Leader" icon={<Trophy size={18} />}>
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-3">
                  <span className="text-xl font-bold text-purple-500">PM</span>
                </div>
                <h3 className="text-lg font-semibold text-hockey-slate">Puck Masters</h3>
                <p className="text-sm text-hockey-light-slate mt-1">14-4-2 Record</p>
                <div className="mt-3 font-medium text-purple-500">268 Total Points</div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Recent Movement" icon={<CalendarClock size={18} />}>
              <div className="space-y-3 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-md bg-hockey-blue flex items-center justify-center text-white text-xs font-bold mr-3">
                    IC
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-hockey-slate">Ice Crushers</div>
                    <div className="text-xs text-hockey-light-slate">Your Team</div>
                  </div>
                  <div className="flex items-center text-green-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="ml-1 text-sm font-medium">2</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                    KR
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-hockey-slate">Kings of the Rink</div>
                    <div className="text-xs text-hockey-light-slate">David Martinez</div>
                  </div>
                  <div className="flex items-center text-green-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="ml-1 text-sm font-medium">1</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                    PP
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-hockey-slate">Puck Panthers</div>
                    <div className="text-xs text-hockey-light-slate">Sarah Wilson</div>
                  </div>
                  <div className="flex items-center text-red-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="ml-1 text-sm font-medium">1</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryLeaders.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-gray-50">
                  <h3 className="font-medium text-hockey-slate">{item.category}</h3>
                </div>
                <div className="p-4 text-center">
                  <div className="text-2xl font-semibold text-hockey-slate mb-1">{item.value}</div>
                  <div className="text-sm text-hockey-light-slate">{item.team}</div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <DashboardCard title="Category Distribution" icon={<BarChart3 size={18} />}>
              <div className="h-[220px]">
                <div className="h-full flex items-end gap-4">
                  {teams.slice(0, 4).map((team, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-card rounded-lg overflow-hidden">
                        <div 
                          className={`w-full ${team.color}`}
                          style={{ height: `${(team.points / 270) * 180}px` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium text-hockey-slate mt-2">{team.abbr}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-hockey-light-slate">Total Points Distribution (Top 4 Teams)</div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="playoffs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Playoff Picture" icon={<Trophy size={18} />}>
              <div className="p-4">
                <div className="relative">
                  <div className="absolute left-16 top-0 bottom-0 border-l-2 border-dashed border-slate-200"></div>
                  
                  {/* Playoff bracket - simplistic version */}
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="w-8 text-center font-medium text-hockey-light-slate mr-2">1</div>
                      <div className="flex items-center bg-card rounded-lg border border-border p-3 shadow-sm relative z-10">
                        <div className="w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                          PM
                        </div>
                        <span className="font-medium text-card-foreground">Puck Masters</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-16">
                      <div className="w-32 h-px bg-slate-200"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-hockey-blue bg-white flex items-center justify-center">
                        <Trophy size={14} className="text-hockey-blue" />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 text-center font-medium text-hockey-light-slate mr-2">4</div>
                      <div className="flex items-center bg-card rounded-lg border border-border p-3 shadow-sm relative z-10">
                        <div className="w-8 h-8 rounded-md bg-hockey-red flex items-center justify-center text-white text-xs font-bold mr-3">
                          FB
                        </div>
                        <span className="font-medium text-hockey-slate">Frozen Blades</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 text-center font-medium text-hockey-light-slate mr-2">2</div>
                      <div className="flex items-center bg-card rounded-lg border border-border p-3 shadow-sm relative z-10">
                        <div className="w-8 h-8 rounded-md bg-hockey-blue flex items-center justify-center text-white text-xs font-bold mr-3">
                          IC
                        </div>
                        <span className="font-medium text-hockey-blue">Ice Crushers</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-16">
                      <div className="w-32 h-px bg-slate-200"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 text-center font-medium text-hockey-light-slate mr-2">3</div>
                      <div className="flex items-center bg-card rounded-lg border border-border p-3 shadow-sm relative z-10">
                        <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                          SS
                        </div>
                        <span className="font-medium text-hockey-slate">Slap Shots</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <div className="space-y-6">
              <DashboardCard title="Playoff Odds" icon={<BarChart3 size={18} />}>
                <div className="space-y-4 p-2">
                  {teams.slice(0, 5).map((team, index) => (
                    <div key={index} className="flex items-center p-2">
                      <div className="flex items-center w-48">
                        <div className={`w-8 h-8 rounded-md ${team.color} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                          {team.abbr}
                        </div>
                        <span className={`font-medium ${team.abbr === 'IC' ? 'text-hockey-blue' : 'text-hockey-slate'}`}>
                          {team.name}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-card rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${team.color}`}
                            style={{ width: `${100 - (index * 12)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-right font-medium text-hockey-slate">
                        {100 - (index * 12)}%
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
              
              <DashboardCard title="Games Remaining" icon={<CalendarClock size={18} />}>
                <div className="p-4">
                  <div className="space-y-3">
                    {teams.slice(0, 4).map((team, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg border border-border">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-md ${team.color} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                            {team.abbr}
                          </div>
                          <span className={`font-medium ${team.abbr === 'IC' ? 'text-hockey-blue' : 'text-hockey-slate'}`}>
                            {team.name}
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-card text-sm font-medium text-hockey-slate">
                          {20 - team.record.wins - team.record.losses - team.record.ties} games
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Standings;
