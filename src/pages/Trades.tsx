import React, { useState } from "react";
import {
  Users,
  ArrowRightLeft,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import DashboardCard from "@/components/dashboard/DashboardCard";

// Mock data for trades
const mockTrades = [
  {
    id: 1,
    team1: "Team Alpha",
    team2: "Team Beta",
    status: "pending",
    timestamp: "2024-12-10T10:00:00Z",
    items: {
      team1: ["Connor McDavid", "2025 1st Round Pick"],
      team2: ["Nathan MacKinnon", "2025 2nd Round Pick"],
    },
    conditions:
      "If McDavid scores 100+ points, Team Beta gets additional 3rd round pick",
  },
  {
    id: 2,
    team1: "Team Gamma",
    team2: "Team Delta",
    status: "completed",
    timestamp: "2024-12-09T15:30:00Z",
    items: {
      team1: ["Auston Matthews"],
      team2: ["Leon Draisaitl", "2025 4th Round Pick"],
    },
    conditions: null,
  },
  {
    id: 3,
    team1: "Team Epsilon",
    team2: "Team Zeta",
    status: "rejected",
    timestamp: "2024-12-08T09:15:00Z",
    items: {
      team1: ["Cale Makar"],
      team2: ["Quinn Hughes", "2025 1st Round Pick"],
    },
    conditions: null,
  },
];

const Trades = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newTrade, setNewTrade] = useState({
    team2: "",
    items: { team1: [], team2: [] },
    conditions: "",
  });

  const getStatusBadge = (status: string) => {
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
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertCircle size={12} className="mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTrades = mockTrades.filter((trade) => {
    const matchesSearch =
      trade.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.team2.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || trade.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          Trading Floor
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
            Trades
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-hockey-blue hover:bg-hockey-dark-blue">
                <Plus size={15} className="mr-1.5" />
                Propose Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Propose New Trade</DialogTitle>
                <DialogDescription>
                  Create a new trade proposal. Remember to post this in Discord
                  for confirmation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Trading Partner</label>
                  <Select
                    value={newTrade.team2}
                    onValueChange={(value) =>
                      setNewTrade({ ...newTrade, team2: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team to trade with" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team-beta">Team Beta</SelectItem>
                      <SelectItem value="team-gamma">Team Gamma</SelectItem>
                      <SelectItem value="team-delta">Team Delta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Your Team Offers
                    </label>
                    <Textarea placeholder="Enter players, prospects, or draft picks you're offering..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">You Receive</label>
                    <Textarea placeholder="Enter players, prospects, or draft picks you want..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Conditions (Optional)
                  </label>
                  <Textarea placeholder="Any conditional terms for this trade..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Propose Trade</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-hockey-light-slate max-w-2xl">
          View and manage trade proposals between teams. All trades must be
          posted in Discord and confirmed by both GMs.
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
                    placeholder="Search trades..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Trades List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-hockey-light-slate">
              {filteredTrades.length} trades found
            </span>
          </div>

          <div className="space-y-4">
            {filteredTrades.map((trade) => (
              <Card
                key={trade.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-hockey-slate">
                          {trade.team1}
                        </span>
                        <ArrowRightLeft
                          size={16}
                          className="text-hockey-light-slate"
                        />
                        <span className="font-medium text-hockey-slate">
                          {trade.team2}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(trade.status)}
                      <span className="text-xs text-hockey-light-slate">
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-hockey-slate mb-2">
                        {trade.team1} Offers:
                      </h4>
                      <ul className="space-y-1">
                        {trade.items.team1.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-hockey-light-slate flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-hockey-blue rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-hockey-slate mb-2">
                        {trade.team2} Offers:
                      </h4>
                      <ul className="space-y-1">
                        {trade.items.team2.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-hockey-light-slate flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-hockey-blue rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {trade.conditions && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h5 className="font-medium text-amber-800 mb-1">
                        Conditions:
                      </h5>
                      <p className="text-sm text-amber-700">
                        {trade.conditions}
                      </p>
                    </div>
                  )}

                  {trade.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept Trade
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject Trade
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

export default Trades;
