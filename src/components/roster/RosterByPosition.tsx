
import React from 'react';
import { Card } from '@/components/ui/card';

interface RosterByPositionProps {
  playersByPosition: {
    centers: any[];
    wings: any[];
    defensemen: any[];
    goalies: any[];
    bench: any[];
  };
  getPositionClass: (position: string) => string;
}

const RosterByPosition: React.FC<RosterByPositionProps> = ({
  playersByPosition,
  getPositionClass
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-hockey-slate mb-3 flex items-center">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-2 text-xs">C</span>
            Centers
          </h3>
          <div className="space-y-2">
            {playersByPosition.centers.map(player => (
              <Card key={player.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-hockey-ice flex items-center justify-center overflow-hidden">
                        <span className="text-hockey-blue font-semibold">{player.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-hockey-slate">{player.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-md ${getPositionClass(player.position)}`}>
                            {player.position}
                          </span>
                          <span className="text-xs text-hockey-light-slate">{player.team}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-l">
                    <div className="text-xs text-hockey-light-slate">Season Stats</div>
                    <div className="font-medium">{player.stats.points} PTS</div>
                    <div className="text-xs">({player.stats.goals}G, {player.stats.assists}A)</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-hockey-slate mb-3 flex items-center">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 mr-2 text-xs">W</span>
            Wingers
          </h3>
          <div className="space-y-2">
            {playersByPosition.wings.map(player => (
              <Card key={player.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-hockey-ice flex items-center justify-center overflow-hidden">
                        <span className="text-hockey-blue font-semibold">{player.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-hockey-slate">{player.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-md ${getPositionClass(player.position)}`}>
                            {player.position}
                          </span>
                          <span className="text-xs text-hockey-light-slate">{player.team}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-l">
                    <div className="text-xs text-hockey-light-slate">Season Stats</div>
                    <div className="font-medium">{player.stats.points} PTS</div>
                    <div className="text-xs">({player.stats.goals}G, {player.stats.assists}A)</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-hockey-slate mb-3 flex items-center">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-800 mr-2 text-xs">D</span>
            Defensemen
          </h3>
          <div className="space-y-2">
            {playersByPosition.defensemen.map(player => (
              <Card key={player.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-hockey-ice flex items-center justify-center overflow-hidden">
                        <span className="text-hockey-blue font-semibold">{player.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-hockey-slate">{player.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-md ${getPositionClass(player.position)}`}>
                            {player.position}
                          </span>
                          <span className="text-xs text-hockey-light-slate">{player.team}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-l">
                    <div className="text-xs text-hockey-light-slate">Season Stats</div>
                    <div className="font-medium">{player.stats.points} PTS</div>
                    <div className="text-xs">({player.stats.goals}G, {player.stats.assists}A)</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-hockey-slate mb-3 flex items-center">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-800 mr-2 text-xs">G</span>
            Goalies
          </h3>
          <div className="space-y-2">
            {playersByPosition.goalies.map(player => (
              <Card key={player.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-hockey-ice flex items-center justify-center overflow-hidden">
                        <span className="text-hockey-blue font-semibold">{player.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-hockey-slate">{player.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-md ${getPositionClass(player.position)}`}>
                            {player.position}
                          </span>
                          <span className="text-xs text-hockey-light-slate">{player.team}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-l">
                    <div className="text-xs text-hockey-light-slate">Goalie Stats</div>
                    <div className="font-medium">{player.stats.wins}-{player.stats.losses}-0</div>
                    <div className="text-xs">{(player.stats.savePercentage || 0).toFixed(3).substring(1)} SV%</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosterByPosition;
