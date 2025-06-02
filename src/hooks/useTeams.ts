import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase";

interface Team {
  id: number;
  name: string;
}

interface DraftTeam {
  team: Team;
}

const fetchTeams = async (draftId: number) => {
  const { data, error } = await supabase
    .from("draft_teams")
    .select(`
      team:teams(*)
    `)
    .eq('draft_id', draftId);

  if (error) throw error;
  return (data as unknown as DraftTeam[]).map(item => item.team);
};

export const useTeams = (draftId: number) => {
  return useQuery({
    queryKey: ["teams", draftId],
    queryFn: () => fetchTeams(draftId),
  });
}; 