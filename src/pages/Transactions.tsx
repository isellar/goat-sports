import React, { useState } from "react";
import {
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  Calendar,
  UserPlus,
  UserMinus,
  TrendingUp,
  TrendingDown,
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import DashboardCard from "@/components/dashboard/DashboardCard";

// Mock data for transactions
const mockTransactions = [
  {
    id: 1,
    type: "add",
    player: "Connor McDavid",
    position: "C",
    team: "EDM",
    from: "Free Agency",
    to: "Active Roster",
    timestamp: "2024-12-10T10:00:00Z",
    gm: "Team Alpha",
    notes: "IR replacement for injured player",
  },
  {
    id: 2,
    type: "drop",
    player: "John Smith",
    position: "D",
    team: "BOS",
    from: "Active Roster",
    to: "Free Agency",
    timestamp: "2024-12-09T15:30:00Z",
    gm: "Team Beta",
    notes: "Underperforming player",
  },
  {
    id: 3,
    type: "promote",
    player: "Alex Wilson",
    position: "G",
    team: "MTL",
    from: "Prospect Roster",
    to: "Active Roster",
    timestamp: "2024-12-08T09:15:00Z",
    gm: "Team Gamma",
    notes: "Starting goalie called up to NHL",
  },
  {
    id: 4,
    type: "demote",
    player: "Mike Johnson",
    position: "C",
    team: "TOR",
    from: "Active Roster",
    to: "Prospect Roster",
    timestamp: "2024-12-07T14:20:00Z",
    gm: "Team Delta",
    notes: "Sent down to AHL",
  },
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    player: "",
    notes: "",
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "add":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Plus size={12} className="mr-1" />
            Add
          </Badge>
        );
      case "drop":
        return (
          <Badge variant="destructive">
            <Minus size={12} className="mr-1" />
            Drop
          </Badge>
        );
      case "promote":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <ArrowUp size={12} className="mr-1" />
            Promote
          </Badge>
        );
      case "demote":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            <ArrowDown size={12} className="mr-1" />
            Demote
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "add":
        return <UserPlus size={16} className="text-green-600" />;
      case "drop":
        return <UserMinus size={16} className="text-red-600" />;
      case "promote":
        return <TrendingUp size={16} className="text-blue-600" />;
      case "demote":
        return <TrendingDown size={16} className="text-orange-600" />;
      default:
        return null;
    }
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.gm.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesPosition =
      positionFilter === "all" || transaction.position === positionFilter;

    const matchesDate =
      !dateFilter ||
      format(new Date(transaction.timestamp), "yyyy-MM-dd") ===
        format(dateFilter, "yyyy-MM-dd");

    return matchesSearch && matchesType && matchesPosition && matchesDate;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          Player Movement
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">
            Transactions
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-hockey-blue hover:bg-hockey-dark-blue">
                <Plus size={15} className="mr-1.5" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Transaction</DialogTitle>
                <DialogDescription>
                  Record a new player transaction. Remember to post this in
                  Discord.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Transaction Type
                  </label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add Player</SelectItem>
                      <SelectItem value="drop">Drop Player</SelectItem>
                      <SelectItem value="promote">Promote Prospect</SelectItem>
                      <SelectItem value="demote">Demote Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Player Name</label>
                  <Input
                    placeholder="Enter player name..."
                    value={newTransaction.player}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        player: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Notes (Optional)
                  </label>
                  <Textarea placeholder="Any additional notes about this transaction..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Record Transaction</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-hockey-light-slate max-w-2xl">
          View and manage all player transactions including adds, drops,
          promotions, and demotions.
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
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="add">Add</SelectItem>
                    <SelectItem value="drop">Drop</SelectItem>
                    <SelectItem value="promote">Promote</SelectItem>
                    <SelectItem value="demote">Demote</SelectItem>
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

              <div>
                <label className="block text-sm font-medium text-hockey-slate mb-2">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFilter ? (
                        format(dateFilter, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {dateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setDateFilter(undefined)}
                  >
                    Clear Date
                  </Button>
                )}
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-hockey-light-slate">
              {filteredTransactions.length} transactions found
            </span>
          </div>

          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="font-medium text-hockey-slate">
                          {transaction.player}
                        </span>
                        <Badge variant="outline">{transaction.position}</Badge>
                        <Badge variant="outline">{transaction.team}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(transaction.type)}
                      <span className="text-xs text-hockey-light-slate">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-hockey-slate mb-2">
                        From:
                      </h4>
                      <p className="text-sm text-hockey-light-slate">
                        {transaction.from}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-hockey-slate mb-2">
                        To:
                      </h4>
                      <p className="text-sm text-hockey-light-slate">
                        {transaction.to}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-hockey-slate mb-2">GM:</h4>
                    <p className="text-sm text-hockey-light-slate">
                      {transaction.gm}
                    </p>
                  </div>

                  {transaction.notes && (
                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <h5 className="font-medium text-slate-800 mb-1">
                        Notes:
                      </h5>
                      <p className="text-sm text-slate-700">
                        {transaction.notes}
                      </p>
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

export default Transactions;
