import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase";

interface FantasyTeam {
  id: number;
  name: string;
}

interface Name {
  id: number;
  given_name: string;
  middle_name?: string;
  family_name: string;
  full_name: string;
  country_id?: number;
}

interface PersonName {
  id: number;
  name: Name;
}

interface Person {
  id: number;
  name: Name; // This will be set to the first joined name
  position?: string;
  number?: number;
  birth_date?: string;
  person_names?: PersonName[];
}

interface FantasyDraftTeam {
  id: number;
  created_at: string;
  fantasy_draft_id: number;
  fantasy_team_id: number;
  team: FantasyTeam;
}

interface FantasyDraftPlayer {
  id: number;
  created_at: string;
  fantasy_draft_id: number;
  person_id: number;
  person: Person;
}

interface Draft {
  id: number;
  created_at: string;
  fantasy_league_id: number;
  draft_name: string;
  start_at: string;
  number_of_rounds: number;
  draft_type: string;
  teams: FantasyDraftTeam[];
  players: FantasyDraftPlayer[];
}

const fetchDraft = async (draftId: number): Promise<Draft> => {
  const { data, error } = await supabase
    .from("fantasy_draft")
    .select(`
      *,
      teams:fantasy_draft_team (
        *,
        team:fantasy_team (*)
      ),
      players:fantasy_draft_player (
        *,
        person:person (
          *,
          person_names:person_name (
            *,
            name:name (*)
          )
        )
      )
    `)
    .eq('id', draftId)
    .single();

  if (error) throw error;

  // Flatten the name for each player (use the first person_name entry)
  if (data && data.players) {
    data.players = data.players.map((draftPlayer: FantasyDraftPlayer) => {
      const person = draftPlayer.person as Person;
      if (person && Array.isArray(person.person_names) && person.person_names.length > 0) {
        draftPlayer.person.name = person.person_names[0].name;
      }
      return draftPlayer;
    });
  }

  return data as Draft;
};

export const useDraft = (draftId: number) => {
  return useQuery({
    queryKey: ["draft", draftId],
    queryFn: () => fetchDraft(draftId),
  });
}; 