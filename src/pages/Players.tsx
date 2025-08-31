import React, { useState } from "react";
import {
  Users,
  Filter,
  Calendar,
  Search,
  Sliders,
  Plus,
  BarChart3,
  ShieldAlert,
} from "lucide-react";
import PlayerCard from "@/components/ui-elements/PlayerCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePlayers, FantraxPlayer } from "@/hooks/usePlayers";

// NHL teams
const nhlTeams = [
  { id: "ANA", name: "Anaheim Ducks" },
  { id: "ARI", name: "Arizona Coyotes" },
  { id: "BOS", name: "Boston Bruins" },
  { id: "BUF", name: "Buffalo Sabres" },
  { id: "CGY", name: "Calgary Flames" },
  { id: "CAR", name: "Carolina Hurricanes" },
  { id: "CHI", name: "Chicago Blackhawks" },
  { id: "COL", name: "Colorado Avalanche" },
  { id: "CBJ", name: "Columbus Blue Jackets" },
  { id: "DAL", name: "Dallas Stars" },
  { id: "DET", name: "Detroit Red Wings" },
  { id: "EDM", name: "Edmonton Oilers" },
  { id: "FLA", name: "Florida Panthers" },
  { id: "LAK", name: "Los Angeles Kings" },
  { id: "MIN", name: "Minnesota Wild" },
  { id: "MTL", name: "Montreal Canadiens" },
  { id: "NSH", name: "Nashville Predators" },
  { id: "NJD", name: "New Jersey Devils" },
  { id: "NYI", name: "New York Islanders" },
  { id: "NYR", name: "New York Rangers" },
  { id: "OTT", name: "Ottawa Senators" },
  { id: "PHI", name: "Philadelphia Flyers" },
  { id: "PIT", name: "Pittsburgh Penguins" },
  { id: "SJS", name: "San Jose Sharks" },
  { id: "SEA", name: "Seattle Kraken" },
  { id: "STL", name: "St. Louis Blues" },
  { id: "TBL", name: "Tampa Bay Lightning" },
  { id: "TOR", name: "Toronto Maple Leafs" },
  { id: "VAN", name: "Vancouver Canucks" },
  { id: "VGK", name: "Vegas Golden Knights" },
  { id: "WSH", name: "Washington Capitals" },
  { id: "WPG", name: "Winnipeg Jets" },
];

// Game dates for the week
const gameDates = [
  { date: "2023-12-04", day: "Monday", games: 5 },
  { date: "2023-12-05", day: "Tuesday", games: 8 },
  { date: "2023-12-06", day: "Wednesday", games: 6 },
  { date: "2023-12-07", day: "Thursday", games: 9 },
  { date: "2023-12-08", day: "Friday", games: 7 },
  { date: "2023-12-09", day: "Saturday", games: 12 },
  { date: "2023-12-10", day: "Sunday", games: 4 },
];

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState("standard");

  // Fetch players from database
  const { data: players, error, isLoading } = usePlayers();

  // Filter players based on all criteria
  const filteredPlayers =
    players?.filter((player) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.team &&
          player.team.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (player.position &&
          player.position.toLowerCase().includes(searchTerm.toLowerCase()));

      // Position filter
      const matchesPosition =
        positionFilter === "all" ||
        (player.position && player.position === positionFilter) ||
        (positionFilter === "F" &&
          player.position &&
          ["C", "LW", "RW"].includes(player.position));

      // Team filter
      const matchesTeam =
        teamFilter === "all" || (player.team && player.team === teamFilter);

      // Availability filter
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && player.available) ||
        (availabilityFilter === "owned" && !player.available);

      // Date filter - this would need real data linking players to game schedules
      // For now, just use the mockup data to simulate
      const matchesDate =
        !selectedDate ||
        (player.next_game_date &&
          player.next_game_date === format(selectedDate, "MMM d"));

      return (
        matchesSearch &&
        matchesPosition &&
        matchesTeam &&
        matchesAvailability &&
        matchesDate
      );
    }) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-hockey-blue">
            Player Pool
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
              Players
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-hockey-blue" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-hockey-blue">
            Player Pool
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
              Players
            </h1>
          </div>
        </div>
        <div className="text-red-500 p-4 text-center">
          Error loading players. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          Player Pool
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
            Players
          </h1>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="h-9 bg-hockey-blue hover:bg-hockey-dark-blue"
            >
              <Plus size={15} className="mr-1.5" /> Add Player
            </Button>
          </div>
        </div>
        <p className="text-hockey-light-slate max-w-2xl">
          Browse available players, view statistics, and add them to your
          roster.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <DashboardCard
            title="Filters"
            icon={<Filter size={20} />}
            className="sticky top-6"
          >
            <div className="space-y-5 py-2">
              {/* Position Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  Position
                </label>
                <RadioGroup
                  value={positionFilter}
                  onValueChange={setPositionFilter}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <label htmlFor="all" className="text-sm">
                      All
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="forwards" />
                    <label htmlFor="forwards" className="text-sm">
                      Forwards
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="C" id="centers" />
                    <label htmlFor="centers" className="text-sm">
                      Centers
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="LW" id="lw" />
                    <label htmlFor="lw" className="text-sm">
                      Left Wing
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="RW" id="rw" />
                    <label htmlFor="rw" className="text-sm">
                      Right Wing
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="D" id="defense" />
                    <label htmlFor="defense" className="text-sm">
                      Defensemen
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="G" id="goalies" />
                    <label htmlFor="goalies" className="text-sm">
                      Goalies
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Team Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  Team
                </label>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {nhlTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  Availability
                </label>
                <RadioGroup
                  value={availabilityFilter}
                  onValueChange={setAvailabilityFilter}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-availability" />
                    <label htmlFor="all-availability" className="text-sm">
                      All
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="available" id="available" />
                    <label htmlFor="available" className="text-sm">
                      Available
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owned" id="owned" />
                    <label htmlFor="owned" className="text-sm">
                      Owned
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Game Date Filter */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  Game Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear Date
                  </Button>
                )}
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  View Mode
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "standard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("standard")}
                  >
                    Standard
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    Table
                  </Button>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Players List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hockey-light-slate"
                size={18}
              />
              <input
                type="text"
                placeholder="Search players..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-hockey-slate focus:outline-none focus:ring-2 focus:ring-hockey-blue/20 focus:border-hockey-blue/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-hockey-light-slate hidden md:inline-block">
                {filteredPlayers.length} players
              </span>
              <Button variant="outline" size="sm">
                <Sliders size={15} className="mr-1.5" /> Sort
              </Button>
            </div>
          </div>

          {viewMode === "standard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <PlayerCard
                    key={`${player.id}-${player.name}-${index}`}
                    name={player.name}
                    team={player.team || ""}
                    position={player.position || ""}
                    number={player.number || ""}
                    stats={{
                      goals: player.goals || 0,
                      assists: player.assists || 0,
                      points: player.points || 0,
                      plusMinus: player.plus_minus || 0,
                      wins: player.wins || 0,
                      losses: player.losses || 0,
                      shutouts: player.shutouts || 0,
                      savePercentage: player.save_percentage || 0,
                    }}
                    status={(player.status as any) || "healthy"}
                    nextGame={
                      player.next_game_opponent && player.next_game_date
                        ? {
                            opponent: player.next_game_opponent,
                            date: player.next_game_date,
                          }
                        : undefined
                    }
                    available={player.available || true}
                    owner={player.owner || null}
                    nextStart={player.next_start || null}
                  />
                ))
              ) : (
                <div className="col-span-2 p-8 text-center text-hockey-light-slate">
                  No players found matching your filters
                </div>
              )}
            </div>
          )}

          {viewMode === "table" && (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Pos</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-right">PTS</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Next Game
                    </TableHead>
                    <TableHead className="text-right">Availability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player, index) => (
                      <TableRow key={`${player.id}-${player.name}-${index}`}>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell>{player.team || "-"}</TableCell>
                        <TableCell>{player.position || "-"}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {player.status === "questionable" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <ShieldAlert size={12} className="mr-1" /> Q
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Healthy
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {player.points || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {player.next_game_opponent &&
                          player.next_game_date ? (
                            <span>
                              {player.next_game_date}{" "}
                              {player.next_game_opponent}
                            </span>
                          ) : (
                            "-"
                          )}
                          {player.position &&
                            player.position === "G" &&
                            player.next_start && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                Starting: {player.next_start}
                              </div>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                          {player.available ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 h-auto"
                            >
                              <Plus size={16} />
                            </Button>
                          ) : (
                            <span className="text-xs text-hockey-light-slate">
                              {player.owner}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No players found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination - Only show if there are multiple pages */}
          {filteredPlayers.length > 20 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default Players;
