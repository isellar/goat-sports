
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamStatsCardsProps {
  mockPlayers: any[];
}

const TeamStatsCards: React.FC<TeamStatsCardsProps> = ({ mockPlayers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Team Stats Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Team Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-sm text-hockey-light-slate">Total Players</span>
            <span className="font-semibold text-hockey-slate">{mockPlayers.length}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-sm text-hockey-light-slate">Active Players</span>
            <span className="font-semibold text-hockey-slate">{mockPlayers.filter(p => p.status === 'healthy').length}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-sm text-hockey-light-slate">Injured Players</span>
            <span className="font-semibold text-hockey-slate">{mockPlayers.filter(p => p.status !== 'healthy').length}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-sm text-hockey-light-slate">Avg. Points</span>
            <span className="font-semibold text-hockey-slate">21.4</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-hockey-light-slate">Total Goals</span>
            <span className="font-semibold text-hockey-slate">88</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Injury Report Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Injury Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-3 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <ShieldAlert size={18} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-hockey-slate">Victor Hedman</h4>
              <p className="text-xs text-hockey-light-slate mb-1">TBL - Defenseman</p>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-xs font-medium">Questionable</span>
                <span className="text-xs text-hockey-light-slate">Lower body injury</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Games Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Upcoming Games</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {mockPlayers.slice(0, 3).map(player => (
              <div key={player.id} className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-hockey-ice/50 flex items-center justify-center overflow-hidden">
                    <span className="text-sm text-hockey-blue font-semibold">{player.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-hockey-slate">{player.name}</div>
                    <div className="text-xs text-hockey-light-slate">{player.team} - {player.position}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-hockey-slate">{player.nextGame?.opponent}</div>
                  <div className="text-xs text-hockey-light-slate">{player.nextGame?.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStatsCards;
