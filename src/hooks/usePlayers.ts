import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase";

export interface FantraxPlayer {
  id: number;
  name: string;
  team?: string;
  position?: string;
  number?: string;
  goals?: number;
  assists?: number;
  points?: number;
  plus_minus?: number;
  wins?: number;
  losses?: number;
  shutouts?: number;
  save_percentage?: number;
  status?: string;
  available?: boolean;
  owner?: string;
  next_game_opponent?: string;
  next_game_date?: string;
  next_start?: string;
}

const fetchPlayers = async () => {
  const { data, error } = await supabase
    .from("fantrax_players")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as FantraxPlayer[];
};

export const usePlayers = () => {
  return useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
  });
};
