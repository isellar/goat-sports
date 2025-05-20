
import React from 'react';
import PlayerCard from '@/components/ui-elements/PlayerCard';

interface RosterCardsProps {
  filteredPlayers: any[];
  searchTerm: string;
}

const RosterCards: React.FC<RosterCardsProps> = ({
  filteredPlayers,
  searchTerm
}) => {
  // Ensure all players have the required stats for display
  const enhancedPlayers = filteredPlayers.map(player => ({
    ...player,
    stats: {
      ...player.stats,
      // Add default values for any missing stats
      goals: player.stats?.goals || 0,
      assists: player.stats?.assists || 0,
      points: player.stats?.points || 0,
      plusMinus: player.stats?.plusMinus || 0,
      pim: player.stats?.pim || 0,
      sog: player.stats?.sog || 0,
      hits: player.stats?.hits || 0,
      blocks: player.stats?.blocks || 0
    }
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {enhancedPlayers.length > 0 ? (
        enhancedPlayers.map(player => (
          <PlayerCard 
            key={player.id}
            name={player.name}
            team={player.team}
            position={player.position}
            number={player.number}
            stats={player.stats}
            status={player.status as any}
            nextGame={player.nextGame}
            available={false}
            owner="Ice Crushers"
          />
        ))
      ) : (
        <div className="col-span-4 p-8 text-center text-hockey-light-slate">
          No players found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default RosterCards;
