
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RosterTableProps {
  sortConfig: {
    key: string;
    direction: 'ascending' | 'descending';
  };
  requestSort: (key: string) => void;
  sortedPlayers: any[];
  getPositionClass: (position: string) => string;
  statusColors: Record<string, string>;
}

const RosterTable: React.FC<RosterTableProps> = ({
  sortConfig,
  requestSort,
  sortedPlayers,
  getPositionClass,
  statusColors
}) => {
  const getSortIcon = (columnName: string) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' ? 
        <ArrowUpDown className="ml-1 h-4 w-4" /> : 
        <ArrowUpDown className="ml-1 h-4 w-4 rotate-180" />;
    }
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-30" />;
  };

  return (
    <div className="border rounded-md overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer w-[200px]" onClick={() => requestSort('name')}>
              <div className="flex items-center">
                Player {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('position')}>
              <div className="flex items-center">
                Pos {getSortIcon('position')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('team')}>
              <div className="flex items-center">
                Team {getSortIcon('team')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer text-center" onClick={() => requestSort('points')}>
              <div className="flex items-center justify-center">
                PTS {getSortIcon('points')}
              </div>
            </TableHead>
            <TableHead className="text-center">G</TableHead>
            <TableHead className="text-center">A</TableHead>
            <TableHead className="text-center">+/-</TableHead>
            <TableHead className="text-center">PIM</TableHead>
            <TableHead className="text-center">SOG</TableHead>
            <TableHead className="text-center">HITS</TableHead>
            <TableHead className="text-center">BLKS</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Game</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.map((player) => (
            <TableRow key={player.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-hockey-ice/70 flex items-center justify-center overflow-hidden">
                    <span className="text-hockey-blue font-semibold">{player.name.charAt(0)}</span>
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-medium rounded-md ${getPositionClass(player.position)}`}>
                  {player.position}
                </span>
              </TableCell>
              <TableCell>{player.team}</TableCell>
              <TableCell className="text-center font-medium">
                {player.position !== 'G' ? player.stats?.points || 0 : player.stats?.wins || 0}
              </TableCell>
              <TableCell className="text-center">
                {player.position !== 'G' ? player.stats?.goals || 0 : '-'}
              </TableCell>
              <TableCell className="text-center">
                {player.position !== 'G' ? player.stats?.assists || 0 : '-'}
              </TableCell>
              <TableCell className="text-center">
                {player.position !== 'G' ? 
                  <span className={player.stats?.plusMinus > 0 ? 'text-green-500' : 
                    player.stats?.plusMinus < 0 ? 'text-red-500' : ''}>
                    {player.stats?.plusMinus > 0 ? `+${player.stats?.plusMinus || 0}` : player.stats?.plusMinus || 0}
                  </span> : 
                  '-'}
              </TableCell>
              <TableCell className="text-center">
                {player.stats?.pim || 0}
              </TableCell>
              <TableCell className="text-center">
                {player.position !== 'G' ? player.stats?.sog || 0 : player.stats?.savePercentage ? 
                  (player.stats.savePercentage * 100).toFixed(1) + '%' : '-'}
              </TableCell>
              <TableCell className="text-center">
                {player.stats?.hits || 0}
              </TableCell>
              <TableCell className="text-center">
                {player.stats?.blocks || 0}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${statusColors[player.status as keyof typeof statusColors]}`}></div>
                  <span className="capitalize text-sm">{player.status}</span>
                </div>
              </TableCell>
              <TableCell>
                {player.nextGame && (
                  <div className="text-sm">
                    <div className="font-medium">{player.nextGame.opponent}</div>
                    <div className="text-hockey-light-slate">{player.nextGame.date}</div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RosterTable;
