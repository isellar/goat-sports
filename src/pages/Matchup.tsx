
import React, { useState } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Info, Users, BarChart3, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DashboardCard from '@/components/dashboard/DashboardCard';
import PlayerCard from '@/components/ui-elements/PlayerCard';
import StatItem from '@/components/dashboard/StatItem';

// Mock point data - for a points league, we track points by player stats
const playerPointValues = {
  goals: 3,
  assists: 2,
  shots: 0.5,
  blocks: 0.5,
  hits: 0.2,
  ppp: 1, // power play points
  gwg: 1, // game winning goals
  wins: 4, // goalie wins
  saves: 0.2, // goalie saves
  shutouts: 4 // goalie shutouts
};

// Mock daily data
const dailyScores = [
  { date: 'Mon, Dec 4', team1: 28.5, team2: 21.2, day: 1 },
  { date: 'Tue, Dec 5', team1: 33.2, team2: 29.8, day: 2 },
  { date: 'Wed, Dec 6', team1: 42.5, team2: 38.7, day: 3 },
  { date: 'Thu, Dec 7', team1: 31.6, team2: 35.4, day: 4 },
  { date: 'Fri, Dec 8', team1: 39.8, team2: 31.2, day: 5 },
  { date: 'Sat, Dec 9', team1: 52.3, team2: 44.7, day: 6 },
  { date: 'Sun, Dec 10', team1: 0, team2: 0, day: 7 }
];

// Team data
const team1 = {
  name: 'Ice Crushers',
  abbr: 'IC',
  color: 'hockey-blue',
  owner: 'You',
  record: '12-6-2',
  rank: '3rd',
  totalPoints: 854.7
};

const team2 = {
  name: 'Frozen Blades',
  abbr: 'FB',
  color: 'hockey-red',
  owner: 'John Doe',
  record: '9-8-3',
  rank: '5th',
  totalPoints: 781.3
};

// Mock top performers with points
const topPerformers = {
  team1: [
    {
      name: "Connor McDavid",
      team: "EDM",
      position: "C",
      pointsEarned: 16.5,
      stats: { goals: 2, assists: 3, points: 5, plusMinus: 2 },
      breakdown: "G: 2 (6pts), A: 3 (6pts), SOG: 8 (4pts), PPP: 1 (0.5pts)"
    },
    {
      name: "Leon Draisaitl",
      team: "EDM",
      position: "C",
      pointsEarned: 14.2,
      stats: { goals: 1, assists: 4, points: 5, plusMinus: 1 },
      breakdown: "G: 1 (3pts), A: 4 (8pts), SOG: 5 (2.5pts), Hits: 3 (0.6pts)"
    },
    {
      name: "Cale Makar",
      team: "COL",
      position: "D",
      pointsEarned: 11.8,
      stats: { goals: 1, assists: 2, points: 3, plusMinus: 3 },
      breakdown: "G: 1 (3pts), A: 2 (4pts), SOG: 6 (3pts), Blocks: 4 (2pts)"
    }
  ],
  team2: [
    {
      name: "Auston Matthews",
      team: "TOR",
      position: "C",
      pointsEarned: 14.5,
      stats: { goals: 3, assists: 1, points: 4, plusMinus: 1 },
      breakdown: "G: 3 (9pts), A: 1 (2pts), SOG: 7 (3.5pts)"
    },
    {
      name: "Nikita Kucherov",
      team: "TBL",
      position: "RW", 
      pointsEarned: 12.3,
      stats: { goals: 1, assists: 3, points: 4, plusMinus: 0 },
      breakdown: "G: 1 (3pts), A: 3 (6pts), SOG: 6 (3pts), PPP: 1 (0.5pts)"
    },
    {
      name: "Roman Josi",
      team: "NSH",
      position: "D",
      pointsEarned: 10.8,
      stats: { goals: 0, assists: 4, points: 4, plusMinus: 1 },
      breakdown: "A: 4 (8pts), SOG: 3 (1.5pts), Blocks: 2 (1pt), Hits: 1 (0.2pts)"
    }
  ]
};

const Matchup = () => {
  const [currentDay, setCurrentDay] = useState(3); // Default to Wednesday (day 3)
  
  // Calculate current scores
  const getCurrentTotals = () => {
    return {
      team1: dailyScores.slice(0, currentDay).reduce((acc, day) => acc + day.team1, 0),
      team2: dailyScores.slice(0, currentDay).reduce((acc, day) => acc + day.team2, 0)
    };
  };
  
  const currentTotals = getCurrentTotals();
  
  const previousDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
    }
  };
  
  const nextDay = () => {
    if (currentDay < dailyScores.length) {
      setCurrentDay(currentDay + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">Weekly Matchup</span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">Week 12</h1>
        <p className="text-hockey-light-slate max-w-2xl">
          View your fantasy points matchup and daily performance.
        </p>
      </div>

      {/* Matchup Overview */}
      <div className="ice-panel rounded-xl p-5 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-xl bg-${team1.color} mx-auto flex items-center justify-center mb-3`}>
              <span className="text-3xl font-bold text-white">{team1.abbr}</span>
            </div>
            <h2 className="text-2xl font-display font-semibold text-hockey-slate">{team1.name}</h2>
            <p className="text-sm text-hockey-light-slate">{team1.owner}</p>
            <div className="mt-3 text-3xl font-bold text-hockey-slate">{currentTotals.team1.toFixed(1)}</div>
            
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Users size={14} className="text-hockey-light-slate" />
                <span className="text-sm text-hockey-light-slate">{team1.record}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy size={14} className="text-hockey-light-slate" />
                <span className="text-sm text-hockey-light-slate">Rank: {team1.rank}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center py-6">
            <div className="text-lg font-medium text-hockey-blue mb-1">December 4 - 10</div>
            <div className="text-sm text-hockey-light-slate mb-4">Week 12</div>
            
            <div className="w-16 h-16 mx-auto rounded-full bg-hockey-blue/10 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-hockey-blue">VS</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={previousDay}
                disabled={currentDay === 1}
                className="h-8 w-8 rounded-full text-hockey-light-slate hover:text-hockey-blue hover:bg-hockey-blue/10"
              >
                <ChevronLeft size={18} />
              </Button>
              <span className="text-sm font-medium text-hockey-slate px-2">
                Day {currentDay} - {dailyScores[currentDay - 1].date}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextDay}
                disabled={currentDay === dailyScores.length}
                className="h-8 w-8 rounded-full text-hockey-light-slate hover:text-hockey-blue hover:bg-hockey-blue/10"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
            
            <div className="mt-3 text-sm text-hockey-light-slate">
              {currentTotals.team1 > currentTotals.team2 
                ? `${team1.name} leading by ${(currentTotals.team1 - currentTotals.team2).toFixed(1)}` 
                : currentTotals.team1 < currentTotals.team2
                  ? `${team2.name} leading by ${(currentTotals.team2 - currentTotals.team1).toFixed(1)}`
                  : "Tied match"}
            </div>
          </div>
          
          <div className="text-center">
            <div className={`w-20 h-20 rounded-xl bg-${team2.color} mx-auto flex items-center justify-center mb-3`}>
              <span className="text-3xl font-bold text-white">{team2.abbr}</span>
            </div>
            <h2 className="text-2xl font-display font-semibold text-hockey-slate">{team2.name}</h2>
            <p className="text-sm text-hockey-light-slate">{team2.owner}</p>
            <div className="mt-3 text-3xl font-bold text-hockey-slate">{currentTotals.team2.toFixed(1)}</div>
            
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Users size={14} className="text-hockey-light-slate" />
                <span className="text-sm text-hockey-light-slate">{team2.record}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy size={14} className="text-hockey-light-slate" />
                <span className="text-sm text-hockey-light-slate">Rank: {team2.rank}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Matchup Details */}
      <Tabs defaultValue="points" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="points">Points Breakdown</TabsTrigger>
          <TabsTrigger value="dailyStats">Daily Stats</TabsTrigger>
          <TabsTrigger value="players">Player Matchups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="points">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard 
              title="Points Scoring System"
              icon={<Info size={18} />}
              variant="points"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-hockey-slate mb-3">Skaters</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Goals</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.goals} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Assists</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.assists} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Shots on Goal</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.shots} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Blocks</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.blocks} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Hits</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.hits} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Power Play Points</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.ppp} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Game Winning Goals</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.gwg} pts</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-hockey-slate mb-3">Goalies</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Wins</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.wins} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Saves</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.saves} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hockey-slate">Shutouts</span>
                      <span className="text-sm font-medium text-hockey-blue">{playerPointValues.shutouts} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Weekly Summary"
              icon={<BarChart3 size={18} />}
              variant="points"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <StatItem
                    label="Your Total"
                    value={currentTotals.team1.toFixed(1)}
                    suffix=" pts"
                    className="flex-1"
                  />
                  <StatItem
                    label="Opponent Total"
                    value={currentTotals.team2.toFixed(1)}
                    suffix=" pts"
                    className="flex-1"
                  />
                </div>
                
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-hockey-blue"
                    style={{ 
                      width: `${(currentTotals.team1 / (currentTotals.team1 + currentTotals.team2)) * 100}%` 
                    }}
                  ></div>
                </div>
                
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hockey-slate">Projected Week Total:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-hockey-blue">{(currentTotals.team1 * 7/currentDay).toFixed(1)}</span>
                      <span className="text-xs text-hockey-light-slate">vs</span>
                      <span className="text-sm font-medium text-hockey-red">{(currentTotals.team2 * 7/currentDay).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="dailyStats">
          <div className="space-y-6">
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200/50 flex items-center justify-between">
                <h3 className="font-semibold text-hockey-slate font-display">Daily Points</h3>
                <CalendarClock size={18} className="text-hockey-light-blue" />
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {dailyScores.map((day, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${currentDay === day.day ? 'border-hockey-blue bg-hockey-blue/5' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className={`text-sm font-medium ${currentDay === day.day ? 'text-hockey-blue' : 'text-hockey-slate'}`}>
                          {day.date}
                        </div>
                        <div className="text-xs text-hockey-light-slate">Day {day.day}</div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-hockey-slate">{day.team1.toFixed(1)}</div>
                          <div className="text-xs text-hockey-light-slate">{team1.name}</div>
                        </div>
                        
                        <div className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-hockey-slate">
                          vs
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-hockey-slate">{day.team2.toFixed(1)}</div>
                          <div className="text-xs text-hockey-light-slate">{team2.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200/50 flex items-center justify-between">
                <h3 className="font-semibold text-hockey-slate font-display">Cumulative Score</h3>
                <BarChart3 size={18} className="text-hockey-light-blue" />
              </div>
              <div className="p-5">
                <div className="h-[200px] flex items-end gap-1">
                  {dailyScores.slice(0, currentDay).map((day, index) => {
                    const team1Total = dailyScores.slice(0, index + 1).reduce((acc, d) => acc + d.team1, 0);
                    const team2Total = dailyScores.slice(0, index + 1).reduce((acc, d) => acc + d.team2, 0);
                    
                    return (
                      <div key={index} className="flex-1 flex items-end gap-1">
                        <div 
                          className="w-1/2 bg-hockey-blue"
                          style={{ height: `${(team1Total / Math.max(team1Total, team2Total)) * 160}px` }}
                        ></div>
                        <div 
                          className="w-1/2 bg-hockey-red"
                          style={{ height: `${(team2Total / Math.max(team1Total, team2Total)) * 160}px` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-hockey-blue"></div>
                    <span className="text-sm text-hockey-slate">{team1.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-hockey-red"></div>
                    <span className="text-sm text-hockey-slate">{team2.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="players">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard 
              title={`${team1.name} Top Performers`}
              icon={<Users size={18} />}
            >
              <div className="space-y-4">
                {topPerformers.team1.map((player, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-hockey-ice/50 flex items-center justify-center overflow-hidden">
                          <span className="text-hockey-blue font-semibold">{player.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-hockey-slate">{player.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-hockey-light-slate">
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>{player.team}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-hockey-blue">{player.pointsEarned.toFixed(1)}</div>
                        <div className="text-xs text-hockey-light-slate">fantasy pts</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-xs text-hockey-light-slate">
                      {player.breakdown}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title={`${team2.name} Top Performers`}
              icon={<Users size={18} />}
            >
              <div className="space-y-4">
                {topPerformers.team2.map((player, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-hockey-ice/50 flex items-center justify-center overflow-hidden">
                          <span className="text-hockey-red font-semibold">{player.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-hockey-slate">{player.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-hockey-light-slate">
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>{player.team}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-hockey-red">{player.pointsEarned.toFixed(1)}</div>
                        <div className="text-xs text-hockey-light-slate">fantasy pts</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-xs text-hockey-light-slate">
                      {player.breakdown}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matchup;
