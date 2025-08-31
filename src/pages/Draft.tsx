import React, { useState } from "react";
import {
  Users,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/dashboard/DashboardCard";

// Mock data for drafts
const mockEntryDraft = {
  id: 1,
  type: "entry",
  year: 2025,
  status: "upcoming",
  startDate: "2025-06-15",
  rounds: 5,
  picks: [
    { round: 1, pick: 1, team: "Team Alpha", player: null, status: "pending" },
    { round: 1, pick: 2, team: "Team Beta", player: null, status: "pending" },
    { round: 1, pick: 3, team: "Team Gamma", player: null, status: "pending" },
    { round: 1, pick: 4, team: "Team Delta", player: null, status: "pending" },
    {
      round: 1,
      pick: 5,
      team: "Team Epsilon",
      player: null,
      status: "pending",
    },
  ],
};

const mockWaiverDraft = {
  id: 2,
  type: "waiver",
  year: 2024,
  status: "completed",
  startDate: "2024-04-01",
  rounds: 2,
  picks: [
    {
      round: 1,
      pick: 1,
      team: "Team Alpha",
      player: "Connor McDavid",
      status: "completed",
    },
    {
      round: 1,
      pick: 2,
      team: "Team Beta",
      player: "Nathan MacKinnon",
      status: "completed",
    },
    {
      round: 1,
      pick: 3,
      team: "Team Gamma",
      player: "Auston Matthews",
      status: "completed",
    },
  ],
};

const mockProspects = [
  {
    id: 1,
    name: "Connor Bedard",
    position: "C",
    team: "CHI",
    nhlDraftYear: 2023,
    nhlDraftPick: 1,
    status: "available",
  },
  {
    id: 2,
    name: "Adam Fantilli",
    position: "C",
    team: "CBJ",
    nhlDraftYear: 2023,
    nhlDraftPick: 3,
    status: "available",
  },
  {
    id: 3,
    name: "Leo Carlsson",
    position: "C",
    team: "ANA",
    nhlDraftYear: 2023,
    nhlDraftPick: 2,
    status: "available",
  },
];

const Draft = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [draftYearFilter, setDraftYearFilter] = useState("all");
  const [selectedProspect, setSelectedProspect] = useState<any>(null);

  const getDraftStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" />
            Upcoming
          </Badge>
        );
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline">
            <Trophy size={12} className="mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPickStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProspects = mockProspects.filter((prospect) => {
    const matchesSearch =
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.team.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      positionFilter === "all" || prospect.position === positionFilter;
    const matchesYear =
      draftYearFilter === "all" ||
      prospect.nhlDraftYear.toString() === draftYearFilter;

    return matchesSearch && matchesPosition && matchesYear;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          Draft Management
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
            Drafts
          </h1>
        </div>
        <p className="text-hockey-light-slate max-w-2xl">
          View and participate in Entry Drafts and Waiver Drafts. Manage your
          draft picks and prospect selections.
        </p>
      </div>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry">Entry Draft</TabsTrigger>
          <TabsTrigger value="waiver">Waiver Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">2025 Entry Draft</CardTitle>
                  <CardDescription>
                    5 rounds of prospects from the 2025 NHL Entry Draft
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getDraftStatusBadge(mockEntryDraft.status)}
                  <span className="text-sm text-hockey-light-slate">
                    Starts:{" "}
                    {new Date(mockEntryDraft.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium text-hockey-slate">Draft Order</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mockEntryDraft.picks.map((pick, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-hockey-slate">
                          Round {pick.round}, Pick {pick.pick}
                        </span>
                        {getPickStatusBadge(pick.status)}
                      </div>
                      <div className="text-sm text-hockey-light-slate">
                        <div>Team: {pick.team}</div>
                        {pick.player && <div>Player: {pick.player}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waiver" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">2024 Waiver Draft</CardTitle>
                  <CardDescription>
                    2 rounds of unprotected players from active rosters
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getDraftStatusBadge(mockWaiverDraft.status)}
                  <span className="text-sm text-hockey-light-slate">
                    Started:{" "}
                    {new Date(mockWaiverDraft.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium text-hockey-slate">Draft Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mockWaiverDraft.picks.map((pick, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-hockey-slate">
                          Round {pick.round}, Pick {pick.pick}
                        </span>
                        {getPickStatusBadge(pick.status)}
                      </div>
                      <div className="text-sm text-hockey-light-slate">
                        <div>Team: {pick.team}</div>
                        <div>Player: {pick.player}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prospects Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-hockey-slate">
            Available Prospects
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1 space-y-6">
            <DashboardCard
              title="Filters"
              icon={<Filter size={20} />}
              className="sticky top-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-hockey-slate mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hockey-light-slate"
                      size={16}
                    />
                    <Input
                      placeholder="Search prospects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-hockey-slate mb-2">
                    Position
                  </label>
                  <Select
                    value={positionFilter}
                    onValueChange={setPositionFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Positions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      <SelectItem value="C">Center</SelectItem>
                      <SelectItem value="LW">Left Wing</SelectItem>
                      <SelectItem value="RW">Right Wing</SelectItem>
                      <SelectItem value="D">Defense</SelectItem>
                      <SelectItem value="G">Goalie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-hockey-slate mb-2">
                    Draft Year
                  </label>
                  <Select
                    value={draftYearFilter}
                    onValueChange={setDraftYearFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Prospects List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-hockey-light-slate">
                {filteredProspects.length} prospects found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProspects.map((prospect) => (
                <Card
                  key={prospect.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedProspect(prospect)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-hockey-slate">
                          {prospect.name}
                        </span>
                        <Badge variant="outline">{prospect.position}</Badge>
                      </div>
                      <Badge variant="outline">{prospect.team}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-hockey-light-slate">
                      <div>
                        NHL Draft: {prospect.nhlDraftYear} - Pick #
                        {prospect.nhlDraftPick}
                      </div>
                      <div>Status: {prospect.status}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prospect Detail Dialog */}
      <Dialog
        open={!!selectedProspect}
        onOpenChange={() => setSelectedProspect(null)}
      >
        <DialogContent>
          {selectedProspect && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProspect.name}</DialogTitle>
                <DialogDescription>
                  Prospect details and scouting information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Position</label>
                    <p className="text-sm text-hockey-light-slate">
                      {selectedProspect.position}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">NHL Team</label>
                    <p className="text-sm text-hockey-light-slate">
                      {selectedProspect.team}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Draft Year</label>
                    <p className="text-sm text-hockey-light-slate">
                      {selectedProspect.nhlDraftYear}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Draft Pick</label>
                    <p className="text-sm text-hockey-light-slate">
                      #{selectedProspect.nhlDraftPick}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProspect(null)}
                  >
                    Close
                  </Button>
                  <Button className="bg-hockey-blue hover:bg-hockey-dark-blue">
                    <UserPlus size={14} className="mr-1" />
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Draft;
