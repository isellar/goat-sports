import React from "react";
import { Card } from "@/components/ui/card";
import { useDraft } from "@/hooks/useDraft";

const PlayerDraft = ({ draftId }: { draftId: number }) => {
  const { data, error, isLoading } = useDraft(draftId);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  if (error)
    return <div className="text-red-500 p-4">Error loading draft.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{data.draft_name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {data.teams && data.teams.length > 0 ? (
          data.teams.map((team) => (
            <Card
              key={team.id}
              className="flex flex-col items-center p-6 bg-card dark:bg-card rounded-xl shadow-sm"
            >
              <span className="text-xl font-semibold mb-2">
                {team.team.name}
              </span>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No teams found for this draft.
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">Players</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.players && data.players.length > 0 ? (
            data.players.map((player) => (
              <Card key={player.id} className="p-4 flex flex-col items-center">
                <span className="font-semibold">
                  {player.person.name.full_name ||
                    `${player.person.name.given_name} ${player.person.name.family_name}`}
                </span>
                {player.person.position && (
                  <span className="text-sm text-muted-foreground">
                    {player.person.position}
                  </span>
                )}
                {player.person.number && (
                  <span className="text-xs text-muted-foreground">
                    #{player.person.number}
                  </span>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No players found for this draft.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDraft;
