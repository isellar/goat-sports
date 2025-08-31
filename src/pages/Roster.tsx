import React, { useState } from "react";
import {
  Filter,
  Plus,
  Users,
  Shield,
  UserCheck,
  UserX,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock player data with expanded statistics and roster status
const mockPlayers = [
  // Active Forwards
  {
    id: 1,
    name: "Connor McDavid",
    team: "EDM",
    position: "C",
    number: "97",
    stats: {
      goals: 12,
      assists: 18,
      points: 30,
      plusMinus: 8,
      pim: 10,
      sog: 65,
      hits: 12,
      blocks: 5,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs CGY", date: "Dec 5" },
  },
  {
    id: 2,
    name: "Leon Draisaitl",
    team: "EDM",
    position: "C",
    number: "29",
    stats: {
      goals: 9,
      assists: 16,
      points: 25,
      plusMinus: 5,
      pim: 8,
      sog: 55,
      hits: 15,
      blocks: 8,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs CGY", date: "Dec 5" },
  },
  {
    id: 3,
    name: "Auston Matthews",
    team: "TOR",
    position: "C",
    number: "34",
    stats: {
      goals: 15,
      assists: 9,
      points: 24,
      plusMinus: 4,
      pim: 4,
      sog: 72,
      hits: 18,
      blocks: 9,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs MTL", date: "Dec 7" },
  },
  {
    id: 4,
    name: "Nathan MacKinnon",
    team: "COL",
    position: "C",
    number: "29",
    stats: {
      goals: 8,
      assists: 15,
      points: 23,
      plusMinus: 10,
      pim: 14,
      sog: 68,
      hits: 10,
      blocks: 5,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs VGK", date: "Dec 6" },
  },
  {
    id: 5,
    name: "Kirill Kaprizov",
    team: "MIN",
    position: "LW",
    number: "97",
    stats: {
      goals: 10,
      assists: 12,
      points: 22,
      plusMinus: 6,
      pim: 8,
      sog: 56,
      hits: 16,
      blocks: 4,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs DAL", date: "Dec 6" },
  },
  {
    id: 6,
    name: "David Pastrnak",
    team: "BOS",
    position: "RW",
    number: "88",
    stats: {
      goals: 14,
      assists: 8,
      points: 22,
      plusMinus: 3,
      pim: 6,
      sog: 58,
      hits: 12,
      blocks: 3,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs PIT", date: "Dec 7" },
  },
  {
    id: 7,
    name: "Sidney Crosby",
    team: "PIT",
    position: "C",
    number: "87",
    stats: {
      goals: 8,
      assists: 14,
      points: 22,
      plusMinus: 5,
      pim: 8,
      sog: 45,
      hits: 15,
      blocks: 7,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "at BOS", date: "Dec 7" },
  },
  // Active Defensemen
  {
    id: 8,
    name: "Cale Makar",
    team: "COL",
    position: "D",
    number: "8",
    stats: {
      goals: 5,
      assists: 18,
      points: 23,
      plusMinus: 12,
      pim: 6,
      sog: 48,
      hits: 22,
      blocks: 32,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs VGK", date: "Dec 6" },
  },
  {
    id: 9,
    name: "Victor Hedman",
    team: "TBL",
    position: "D",
    number: "77",
    stats: {
      goals: 3,
      assists: 12,
      points: 15,
      plusMinus: 2,
      pim: 12,
      sog: 45,
      hits: 24,
      blocks: 28,
      gamesPlayed: 25,
    },
    status: "questionable",
    rosterStatus: "active",
    nextGame: { opponent: "vs NYR", date: "Dec 8" },
  },
  {
    id: 10,
    name: "Adam Fox",
    team: "NYR",
    position: "D",
    number: "23",
    stats: {
      goals: 4,
      assists: 14,
      points: 18,
      plusMinus: 9,
      pim: 4,
      sog: 38,
      hits: 18,
      blocks: 25,
      gamesPlayed: 25,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "at TBL", date: "Dec 8" },
  },
  // Bench Players
  {
    id: 11,
    name: "Mitch Marner",
    team: "TOR",
    position: "RW",
    number: "16",
    stats: {
      goals: 6,
      assists: 12,
      points: 18,
      plusMinus: 2,
      pim: 6,
      sog: 42,
      hits: 8,
      blocks: 4,
      gamesPlayed: 25,
    },
    status: "healthy",
    rosterStatus: "bench",
    nextGame: { opponent: "vs MTL", date: "Dec 7" },
  },
  {
    id: 12,
    name: "John Carlson",
    team: "WSH",
    position: "D",
    number: "74",
    stats: {
      goals: 2,
      assists: 8,
      points: 10,
      plusMinus: -1,
      pim: 8,
      sog: 35,
      hits: 15,
      blocks: 20,
      gamesPlayed: 25,
    },
    status: "healthy",
    rosterStatus: "bench",
    nextGame: { opponent: "vs NJD", date: "Dec 6" },
  },
  // IR Players
  {
    id: 13,
    name: "Erik Karlsson",
    team: "PIT",
    position: "D",
    number: "65",
    stats: {
      goals: 1,
      assists: 6,
      points: 7,
      plusMinus: -3,
      pim: 4,
      sog: 28,
      hits: 12,
      blocks: 18,
      gamesPlayed: 15,
    },
    status: "injured",
    rosterStatus: "ir",
    nextGame: { opponent: "at BOS", date: "Dec 7" },
  },
  {
    id: 14,
    name: "Patrice Bergeron",
    team: "BOS",
    position: "C",
    number: "37",
    stats: {
      goals: 3,
      assists: 5,
      points: 8,
      plusMinus: 1,
      pim: 2,
      sog: 22,
      hits: 10,
      blocks: 6,
      gamesPlayed: 12,
    },
    status: "out",
    rosterStatus: "ir",
    nextGame: { opponent: "vs PIT", date: "Dec 7" },
  },
  // Prospect Players (less than 101 games for skaters)
  {
    id: 15,
    name: "Connor Bedard",
    team: "CHI",
    position: "C",
    number: "98",
    stats: {
      goals: 8,
      assists: 10,
      points: 18,
      plusMinus: -8,
      pim: 10,
      sog: 45,
      hits: 8,
      blocks: 3,
      gamesPlayed: 25,
    },
    status: "healthy",
    rosterStatus: "prospect",
    nextGame: { opponent: "vs STL", date: "Dec 8" },
  },
  {
    id: 16,
    name: "Luke Hughes",
    team: "NJD",
    position: "D",
    number: "43",
    stats: {
      goals: 2,
      assists: 8,
      points: 10,
      plusMinus: 2,
      pim: 6,
      sog: 32,
      hits: 12,
      blocks: 15,
      gamesPlayed: 25,
    },
    status: "healthy",
    rosterStatus: "prospect",
    nextGame: { opponent: "at WSH", date: "Dec 6" },
  },
  // Active Goalies
  {
    id: 17,
    name: "Igor Shesterkin",
    team: "NYR",
    position: "G",
    number: "31",
    stats: {
      wins: 10,
      losses: 3,
      shutouts: 2,
      savePercentage: 0.925,
      pim: 2,
      gamesPlayed: 15,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "at TBL", date: "Dec 8" },
  },
  {
    id: 18,
    name: "Andrei Vasilevskiy",
    team: "TBL",
    position: "G",
    number: "88",
    stats: {
      wins: 8,
      losses: 4,
      shutouts: 1,
      savePercentage: 0.919,
      pim: 2,
      gamesPlayed: 15,
    },
    status: "active",
    rosterStatus: "active",
    nextGame: { opponent: "vs NYR", date: "Dec 8" },
  },
  // Bench Goalies
  {
    id: 19,
    name: "Jake Oettinger",
    team: "DAL",
    position: "G",
    number: "29",
    stats: {
      wins: 6,
      losses: 5,
      shutouts: 1,
      savePercentage: 0.912,
      pim: 0,
      gamesPlayed: 12,
    },
    status: "healthy",
    rosterStatus: "bench",
    nextGame: { opponent: "vs MIN", date: "Dec 6" },
  },
  // IR Goalies
  {
    id: 20,
    name: "Carey Price",
    team: "MTL",
    position: "G",
    number: "31",
    stats: {
      wins: 0,
      losses: 0,
      shutouts: 0,
      savePercentage: 0.0,
      pim: 0,
      gamesPlayed: 0,
    },
    status: "out",
    rosterStatus: "ir",
    nextGame: { opponent: "at TOR", date: "Dec 7" },
  },
  // Prospect Goalies (less than 51 games)
  {
    id: 21,
    name: "Dustin Wolf",
    team: "CGY",
    position: "G",
    number: "32",
    stats: {
      wins: 2,
      losses: 1,
      shutouts: 0,
      savePercentage: 0.918,
      pim: 0,
      gamesPlayed: 4,
    },
    status: "healthy",
    rosterStatus: "prospect",
    nextGame: { opponent: "at EDM", date: "Dec 5" },
  },
];

// Group players by roster status and position
const getPlayersByRosterStatus = () => {
  return {
    // Skaters
    skatersActive: mockPlayers.filter(
      (p) => p.rosterStatus === "active" && p.position !== "G"
    ),
    skatersBench: mockPlayers.filter(
      (p) => p.rosterStatus === "bench" && p.position !== "G"
    ),
    skatersIR: mockPlayers.filter(
      (p) => p.rosterStatus === "ir" && p.position !== "G"
    ),
    skatersProspect: mockPlayers.filter(
      (p) => p.rosterStatus === "prospect" && p.position !== "G"
    ),
    // Goalies
    goaliesActive: mockPlayers.filter(
      (p) => p.rosterStatus === "active" && p.position === "G"
    ),
    goaliesBench: mockPlayers.filter(
      (p) => p.rosterStatus === "bench" && p.position === "G"
    ),
    goaliesIR: mockPlayers.filter(
      (p) => p.rosterStatus === "ir" && p.position === "G"
    ),
    goaliesProspect: mockPlayers.filter(
      (p) => p.rosterStatus === "prospect" && p.position === "G"
    ),
  };
};

const positionColors = {
  C: "bg-blue-100 text-blue-800 border-blue-200",
  LW: "bg-green-100 text-green-800 border-green-200",
  RW: "bg-green-100 text-green-800 border-green-200",
  D: "bg-red-100 text-red-800 border-red-200",
  G: "bg-purple-100 text-purple-800 border-purple-200",
};

const rosterStatusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  bench: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ir: "bg-red-100 text-red-800 border-red-200",
  prospect: "bg-blue-100 text-blue-800 border-blue-200",
};

const rosterStatusIcons = {
  active: Users,
  bench: Shield,
  ir: UserX,
  prospect: Star,
};

const Roster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const playersByStatus = getPlayersByRosterStatus();

  const filteredPlayers = mockPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionClass = (position: string) => {
    for (const [pos, color] of Object.entries(positionColors)) {
      if (position.includes(pos)) {
        return color;
      }
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRosterStatusClass = (status: string) => {
    return (
      rosterStatusColors[status as keyof typeof rosterStatusColors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getRosterStatusIcon = (status: string) => {
    const IconComponent =
      rosterStatusIcons[status as keyof typeof rosterStatusIcons];
    return IconComponent ? <IconComponent size={14} /> : null;
  };

  const renderPlayerCard = (player: any) => (
    <Card
      key={player.id}
      className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center p-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-hockey-ice flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-hockey-blue font-semibold text-sm">
                {player.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-hockey-slate text-sm truncate">
                {player.name}
              </h4>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs px-1.5 py-0.5 ${getPositionClass(
                    player.position
                  )}`}
                >
                  {player.position}
                </Badge>
                <span className="text-xs text-hockey-light-slate">
                  {player.team}
                </span>
                {player.rosterStatus !== "active" && (
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0.5 ${getRosterStatusClass(
                      player.rosterStatus
                    )}`}
                  >
                    {getRosterStatusIcon(player.rosterStatus)}
                    <span className="ml-1">{player.rosterStatus}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-hockey-light-slate flex-shrink-0">
          {player.position === "G" ? (
            <div>
              <div className="font-medium">
                {player.stats.wins}-{player.stats.losses}-0
              </div>
              <div>
                {(player.stats.savePercentage || 0).toFixed(3).substring(1)} SV%
              </div>
            </div>
          ) : (
            <div>
              <div className="font-medium">{player.stats.points} PTS</div>
              <div>
                ({player.stats.goals}G, {player.stats.assists}A)
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const renderRosterSection = (
    title: string,
    players: any[],
    icon: React.ReactNode,
    color: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${color}`}>{icon}</div>
        <h3 className="text-lg font-semibold text-hockey-slate">{title}</h3>
        <Badge variant="secondary" className="ml-auto">
          {players.length}
        </Badge>
      </div>
      <div className="space-y-1">
        {players.length > 0 ? (
          players.map((player) => renderPlayerCard(player))
        ) : (
          <div className="text-center py-4 text-hockey-light-slate text-sm">
            No players in this category
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          Team Roster
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
            Ice Crushers
          </h1>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="h-9">
              <Filter size={15} className="mr-1.5" /> Filter
            </Button>
            <Button
              size="sm"
              className="h-9 bg-hockey-blue hover:bg-hockey-dark-blue"
            >
              <Plus size={15} className="mr-1.5" /> Add Player
            </Button>
          </div>
        </div>
        <p className="text-hockey-light-slate">
          Manage your roster with active players, bench, IR, and prospects.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hockey-blue focus:border-transparent"
          />
          <Users
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hockey-light-slate"
          />
        </div>
      </div>

      {/* Roster Sections */}
      <div className="space-y-8">
        {/* Skaters Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Skaters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Skaters */}
              {renderRosterSection(
                "Active (F/D)",
                playersByStatus.skatersActive,
                <Users size={16} className="text-green-600" />,
                "bg-green-100"
              )}

              {/* Bench Skaters */}
              {renderRosterSection(
                "Bench",
                playersByStatus.skatersBench,
                <Shield size={16} className="text-yellow-600" />,
                "bg-yellow-100"
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* IR Skaters */}
              {renderRosterSection(
                "Injured Reserve",
                playersByStatus.skatersIR,
                <UserX size={16} className="text-red-600" />,
                "bg-red-100"
              )}

              {/* Prospect Skaters */}
              {renderRosterSection(
                "Prospects (<101 GP)",
                playersByStatus.skatersProspect,
                <Star size={16} className="text-blue-600" />,
                "bg-blue-100"
              )}
            </div>
          </CardContent>
        </Card>

        {/* Goalies Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Goaltenders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Goalies */}
              {renderRosterSection(
                "Active",
                playersByStatus.goaliesActive,
                <Users size={16} className="text-green-600" />,
                "bg-green-100"
              )}

              {/* Bench Goalies */}
              {renderRosterSection(
                "Bench",
                playersByStatus.goaliesBench,
                <Shield size={16} className="text-yellow-600" />,
                "bg-yellow-100"
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* IR Goalies */}
              {renderRosterSection(
                "Injured Reserve",
                playersByStatus.goaliesIR,
                <UserX size={16} className="text-red-600" />,
                "bg-red-100"
              )}

              {/* Prospect Goalies */}
              {renderRosterSection(
                "Prospects (<51 GP)",
                playersByStatus.goaliesProspect,
                <Star size={16} className="text-blue-600" />,
                "bg-blue-100"
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Roster;
