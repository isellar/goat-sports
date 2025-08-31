import React, { useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Plus,
  UserMinus,
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
import DashboardCard from "@/components/dashboard/DashboardCard";

// Mock data for waivers
const mockWaivers = [
  {
    id: 1,
    player: "John Smith",
    position: "C",
    team: "BOS",
    waivedBy: "Team Alpha",
    timestamp: "2024-12-10T10:00:00Z",
    status: "active",
    claims: ["Team Beta", "Team Gamma"],
    expiresAt: "2024-12-11T10:00:00Z",
  },
  {
    id: 2,
    player: "Mike Johnson",
    position: "D",
    team: "TOR",
    waivedBy: "Team Beta",
    timestamp: "2024-12-09T15:30:00Z",
    status: "claimed",
    claims: ["Team Delta"],
    claimedBy: "Team Delta",
    expiresAt: "2024-12-10T15:30:00Z",
  },
  {
    id: 3,
    player: "Alex Wilson",
    position: "G",
    team: "MTL",
    waivedBy: "Team Gamma",
    timestamp: "2024-12-08T09:15:00Z",
    status: "cleared",
    claims: [],
    expiresAt: "2024-12-09T09:15:00Z",
  },
];

const Waivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [newWaiver, setNewWaiver] = useState({
    player: "",
    reason: "",
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Active
          </Badge>
        );
      case "claimed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Claimed
          </Badge>
        );
      case "cleared":
        return (
          <Badge variant="outline">
            <XCircle size={12} className="mr-1" />
            Cleared
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const filteredWaivers = mockWaivers.filter((waiver) => {
    const matchesSearch =
      waiver.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
      waiver.team.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || waiver.status === statusFilter;
    const matchesPosition =
      positionFilter === "all" || waiver.position === positionFilter;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          Player Movement
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
            Waivers
          </h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserMinus size={15} className="mr-1.5" />
                  Waive Player
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Waive Player</DialogTitle>
                  <DialogDescription>
                    Submit a player for waivers. They will be moved to your
                    prospect roster.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Player Name</label>
                    <Input
                      placeholder="Enter player name..."
                      value={newWaiver.player}
                      onChange={(e) =>
                        setNewWaiver({ ...newWaiver, player: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Reason (Optional)
                    </label>
                    <Textarea placeholder="Why are you waiving this player?" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Submit Waiver</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <p className="text-hockey-light-slate max-w-2xl">
          View players on waivers and submit claims. Waivers last 24 hours and
          are processed based on standings priority.
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
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </DashboardCard>
        </div>

        {/* Waivers List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-hockey-light-slate">
              {filteredWaivers.length} waivers found
            </span>
          </div>

          <div className="space-y-4">
            {filteredWaivers.map((waiver) => (
              <Card
                key={waiver.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-hockey-slate">
                          {waiver.player}
                        </span>
                        <Badge variant="outline">{waiver.position}</Badge>
                        <Badge variant="outline">{waiver.team}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(waiver.status)}
                      <span className="text-xs text-hockey-light-slate">
                        {new Date(waiver.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-hockey-slate mb-2">
                        Waived By:
                      </h4>
                      <p className="text-sm text-hockey-light-slate">
                        {waiver.waivedBy}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-hockey-slate mb-2">
                        Time Remaining:
                      </h4>
                      <p className="text-sm text-hockey-light-slate">
                        {getTimeRemaining(waiver.expiresAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-hockey-slate mb-2">
                      Claims:
                    </h4>
                    {waiver.claims.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {waiver.claims.map((claim, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 text-blue-700"
                          >
                            {claim}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-hockey-light-slate">
                        No claims yet
                      </p>
                    )}
                  </div>

                  {waiver.status === "claimed" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-1">
                        Claimed by:
                      </h5>
                      <p className="text-sm text-green-700">
                        {waiver.claimedBy}
                      </p>
                    </div>
                  )}

                  {waiver.status === "active" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus size={14} className="mr-1" />
                        Submit Claim
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waivers;
