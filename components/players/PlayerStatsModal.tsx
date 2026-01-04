'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Player } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface PlayerStatsModalProps {
  player: Player;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlayerStatsModal({ player, open, onOpenChange }: PlayerStatsModalProps) {
  const isGoalie = player.position === 'G';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{player.name} - Detailed Stats</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isGoalie ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stat</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Wins (W)</TableCell>
                  <TableCell className="text-right">{player.wins ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Overtime Wins (OW)</TableCell>
                  <TableCell className="text-right">{player.overtimeWins ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Overtime Losses + Shootout Losses (OL+SHL)</TableCell>
                  <TableCell className="text-right">
                    {(player.overtimeLosses ?? 0) + (player.shootoutLosses ?? 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Goals Against (GA)</TableCell>
                  <TableCell className="text-right">{player.goalsAgainst ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Saves (SV)</TableCell>
                  <TableCell className="text-right">{player.saves ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Shutouts (SHO)</TableCell>
                  <TableCell className="text-right">{player.shutouts ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Shootout Wins (ShW)</TableCell>
                  <TableCell className="text-right">{player.shootoutWins ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Goals (G)</TableCell>
                  <TableCell className="text-right">{player.goalieGoals ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Assists (A)</TableCell>
                  <TableCell className="text-right">{player.goalieAssists ?? 0}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stat</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Goals (G)</TableCell>
                  <TableCell className="text-right">{player.goals ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Assists (A)</TableCell>
                  <TableCell className="text-right">{player.assists ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Penalty Minutes (PIM)</TableCell>
                  <TableCell className="text-right">{player.penaltyMinutes ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Shots on Goal (SOG)</TableCell>
                  <TableCell className="text-right">{player.shotsOnGoal ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Power Play Points (PPP)</TableCell>
                  <TableCell className="text-right">{player.powerPlayPoints ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Short Handed Points (SHP)</TableCell>
                  <TableCell className="text-right">{player.shortHandedPoints ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hits (Hit)</TableCell>
                  <TableCell className="text-right">{player.hits ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Blocks (Blk)</TableCell>
                  <TableCell className="text-right">{player.blocks ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Takeaways (Tk)</TableCell>
                  <TableCell className="text-right">{player.takeaways ?? 0}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

