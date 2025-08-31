import React, { useState } from "react";
import {
  Gavel,
  BookOpen,
  Vote,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import DashboardCard from "@/components/dashboard/DashboardCard";

// Mock data for league information
const mockVotes = [
  {
    id: 1,
    title: "Rule Change: Increase Prospect Roster Limit",
    description:
      "Proposal to increase prospect roster limit from 60 to 65 players",
    status: "active",
    startDate: "2024-12-10T00:00:00Z",
    endDate: "2024-12-12T00:00:00Z",
    votes: {
      yes: 8,
      no: 3,
      abstain: 1,
    },
    totalVotes: 12,
    requiredVotes: 8,
    category: "rule-change",
  },
  {
    id: 2,
    title: "Contest: Weekly Prediction Challenge",
    description: "New weekly contest for predicting game outcomes",
    status: "upcoming",
    startDate: "2024-12-15T00:00:00Z",
    endDate: "2024-12-17T00:00:00Z",
    votes: null,
    totalVotes: 0,
    requiredVotes: 8,
    category: "contest",
  },
  {
    id: 3,
    title: "Trade Deadline Extension",
    description: "Extend trade deadline by 1 week",
    status: "completed",
    startDate: "2024-12-01T00:00:00Z",
    endDate: "2024-12-03T00:00:00Z",
    votes: {
      yes: 10,
      no: 2,
      abstain: 0,
    },
    totalVotes: 12,
    requiredVotes: 8,
    category: "rule-change",
  },
];

const mockRules = [
  {
    section: "I. TERMS",
    title: "Season Definitions",
    content:
      "Regular Season: October(ish) - the end of the RDHL season (mid-March), 20+ weeks. Playoffs: RDHL playoffs (begin March - ends beginning of April), 6 weeks (2 week match-ups). Off-Season: Immediately following the playoffs.",
  },
  {
    section: "II. RESPONSIBILITIES",
    title: "Participation Requirements",
    content:
      "This is intended to be a fun league and not a job, therefore the minimum participation requirements are intentionally low. Making trades, participating in contests, voting and general discussion are always encouraged, but never required.",
  },
  {
    section: "IV. ROSTERS",
    title: "Roster Limits",
    content:
      "Active Roster of 12 Forwards, 6 Defensemen, 2 Goalies, 4 Reserve, Unlimited IR. There is also a 60 player Prospect Roster for Skaters with less than 101 NHL games and Goalies with less than 51 NHL games.",
  },
  {
    section: "V. SCORING",
    title: "Points System",
    content:
      "This league uses a 'head-to-head' point system on Fantrax. Goals: 2.5, Assists: 2, Hits: 0.3, Blocked Shots: 0.3, PPP: 1, SHP: 1.5, PIM: 0.2, D-Man Points: 0.25, SOG: 0.067, Takeaways: 0.1",
  },
];

const League = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedVote, setSelectedVote] = useState<any>(null);
  const [userVote, setUserVote] = useState("");

  const getVoteStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Clock size={12} className="mr-1" />
            Active
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Calendar size={12} className="mr-1" />
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "rule-change":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Rule Change
          </Badge>
        );
      case "contest":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Contest
          </Badge>
        );
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getVoteProgress = (vote: any) => {
    if (!vote.votes) return 0;
    const total = vote.votes.yes + vote.votes.no + vote.votes.abstain;
    return (total / vote.requiredVotes) * 100;
  };

  const filteredVotes = mockVotes.filter((vote) => {
    const matchesSearch =
      vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || vote.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || vote.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredRules = mockRules.filter((rule) => {
    return (
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          League Management
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
            League
          </h1>
        </div>
        <p className="text-hockey-light-slate max-w-2xl">
          View league rules, participate in voting, and access league
          information and governance.
        </p>
      </div>

      <Tabs defaultValue="votes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="votes">Voting</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="info">League Info</TabsTrigger>
        </TabsList>

        <TabsContent value="votes" className="space-y-6">
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
                        placeholder="Search votes..."
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
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-hockey-slate mb-2">
                      Category
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="rule-change">Rule Change</SelectItem>
                        <SelectItem value="contest">Contest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DashboardCard>
            </div>

            {/* Votes List */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-hockey-light-slate">
                  {filteredVotes.length} votes found
                </span>
              </div>

              <div className="space-y-4">
                {filteredVotes.map((vote) => (
                  <Card
                    key={vote.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-hockey-slate">
                            {vote.title}
                          </h3>
                          {getCategoryBadge(vote.category)}
                        </div>
                        <div className="flex items-center gap-2">
                          {getVoteStatusBadge(vote.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-hockey-light-slate mb-4">
                        {vote.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-hockey-slate">
                            Start Date:
                          </span>
                          <p className="text-sm text-hockey-light-slate">
                            {new Date(vote.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-hockey-slate">
                            End Date:
                          </span>
                          <p className="text-sm text-hockey-light-slate">
                            {new Date(vote.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {vote.status === "active" && vote.votes && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>
                              Vote Progress: {vote.totalVotes}/
                              {vote.requiredVotes}
                            </span>
                            <span>{Math.round(getVoteProgress(vote))}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-hockey-blue h-2 rounded-full"
                              style={{ width: `${getVoteProgress(vote)}%` }}
                            ></div>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span>Yes: {vote.votes.yes}</span>
                            <span>No: {vote.votes.no}</span>
                            <span>Abstain: {vote.votes.abstain}</span>
                          </div>
                        </div>
                      )}

                      {vote.status === "active" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => setSelectedVote(vote)}
                          >
                            <Vote size={14} className="mr-1" />
                            Vote Now
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-hockey-light-slate">
                {filteredRules.length} rules found
              </span>
            </div>

            {filteredRules.map((rule, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {rule.section}: {rule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-hockey-light-slate leading-relaxed">
                    {rule.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  League Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Teams:</span>
                  <span className="font-medium">20</span>
                </div>
                <div className="flex justify-between">
                  <span>Playoff Teams:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Regular Season:</span>
                  <span className="font-medium">20+ weeks</span>
                </div>
                <div className="flex justify-between">
                  <span>Playoffs:</span>
                  <span className="font-medium">6 weeks</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel size={20} />
                  Committee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Commissioner:</span>
                  <span className="font-medium">Lead GM</span>
                </div>
                <div className="flex justify-between">
                  <span>Committee Members:</span>
                  <span className="font-medium">5 GMs</span>
                </div>
                <div className="flex justify-between">
                  <span>Voting Required:</span>
                  <span className="font-medium">50% + 8 GMs</span>
                </div>
                <div className="flex justify-between">
                  <span>Vote Duration:</span>
                  <span className="font-medium">48+ hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Vote Dialog */}
      <Dialog open={!!selectedVote} onOpenChange={() => setSelectedVote(null)}>
        <DialogContent>
          {selectedVote && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVote.title}</DialogTitle>
                <DialogDescription>
                  Cast your vote on this proposal
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-hockey-light-slate">
                  {selectedVote.description}
                </p>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Vote
                  </label>
                  <RadioGroup value={userVote} onValueChange={setUserVote}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label
                        htmlFor="yes"
                        className="text-green-700 font-medium"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="text-red-700 font-medium">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="abstain" id="abstain" />
                      <Label htmlFor="abstain" className="text-slate-700">
                        Abstain
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVote(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!userVote}
                    onClick={() => {
                      // Handle vote submission
                      setSelectedVote(null);
                      setUserVote("");
                    }}
                  >
                    Submit Vote
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

export default League;
