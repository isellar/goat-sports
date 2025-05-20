import React from "react";
import {
  BarChart3,
  CalendarClock,
  Trophy,
  Users,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  BellRing,
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatItem from "@/components/dashboard/StatItem";
import PlayerCard from "@/components/ui-elements/PlayerCard";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">
          League Dashboard
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
          RDHL
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Welcome to your fantasy hockey league dashboard. View your team stats,
          upcoming matchups, and league standings.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatItem
          label="League Rank"
          value="3rd"
          icon={<Trophy size={20} />}
          trend="up"
          trendValue="Up 2"
          className="p-4 glass-panel rounded-xl"
        />
        <StatItem
          label="Season Record"
          value="12-6-2"
          icon={<BarChart3 size={20} />}
          trend="neutral"
          className="p-4 glass-panel rounded-xl"
        />
        <StatItem
          label="Total Points"
          value={237}
          icon={<TrendingUp size={20} />}
          trend="up"
          trendValue="+12"
          className="p-4 glass-panel rounded-xl"
        />
        <StatItem
          label="Roster Health"
          value="92%"
          icon={<ShieldAlert size={20} />}
          trend="down"
          trendValue="-3%"
          className="p-4 glass-panel rounded-xl"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Matchup */}
          <DashboardCard
            title="Current Matchup"
            icon={<CalendarClock size={20} />}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-hockey-blue flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">IC</span>
                </div>
                <h4 className="font-semibold text-card-foreground">
                  Ice Crushers
                </h4>
                <p className="text-sm text-muted-foreground">Your Team</p>
                <div className="mt-2 text-2xl font-bold text-card-foreground">
                  126
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-hockey-blue font-semibold mb-1">
                  Week 12
                </div>
                <div className="text-xs text-hockey-light-slate mb-3">
                  Dec 4 - Dec 10
                </div>
                <div className="px-4 py-2 rounded-full bg-hockey-blue/10 font-medium text-hockey-blue">
                  vs
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-hockey-red flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">FB</span>
                </div>
                <h4 className="font-semibold text-card-foreground">
                  Frozen Blades
                </h4>
                <p className="text-sm text-muted-foreground">John's Team</p>
                <div className="mt-2 text-2xl font-bold text-card-foreground">
                  98
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link
                to="/matchup"
                className="flex items-center gap-1 px-4 py-2 text-sm text-hockey-blue hover:text-hockey-dark-blue transition-colors"
              >
                View Full Matchup <ArrowRight size={16} />
              </Link>
            </div>
          </DashboardCard>

          {/* Top Available Players */}
          <DashboardCard
            title="Top Available Players"
            icon={<TrendingUp size={20} />}
          >
            <div className="space-y-3">
              <PlayerCard
                name="Mikko Rantanen"
                team="COL"
                position="RW"
                stats={{ goals: 11, assists: 17, points: 28, plusMinus: 7 }}
                compact
                available={true}
              />
              <PlayerCard
                name="Brad Marchand"
                team="BOS"
                position="LW"
                stats={{ goals: 8, assists: 14, points: 22, plusMinus: 9 }}
                compact
                available={true}
              />
              <PlayerCard
                name="Igor Shesterkin"
                team="NYR"
                position="G"
                stats={{ goals: 0, assists: 0, points: 0, plusMinus: 0 }}
                compact
                available={true}
                nextStart="Dec 5 vs CHI"
              />
            </div>

            <div className="flex justify-center mt-4">
              <Link
                to="/players"
                className="flex items-center gap-1 px-4 py-2 text-sm text-hockey-blue hover:text-hockey-dark-blue transition-colors"
              >
                View All Available Players <ArrowRight size={16} />
              </Link>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <DashboardCard
            title="Upcoming Matchups"
            icon={<CalendarClock size={20} />}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex justify-between items-center">
                  <div className="text-hockey-blue font-medium">Week 13</div>
                  <div className="text-xs text-hockey-light-slate">
                    Dec 11 - Dec 17
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-medium text-hockey-slate">vs</span>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                    <span className="ml-2">Puck Panthers</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex justify-between items-center">
                  <div className="text-hockey-blue font-medium">Week 14</div>
                  <div className="text-xs text-hockey-light-slate">
                    Dec 18 - Dec 24
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-medium text-hockey-slate">vs</span>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      K
                    </div>
                    <span className="ml-2">Kings of the Rink</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex justify-between items-center">
                  <div className="text-hockey-blue font-medium">Week 15</div>
                  <div className="text-xs text-hockey-light-slate">
                    Dec 25 - Dec 31
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-medium text-hockey-slate">vs</span>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      S
                    </div>
                    <span className="ml-2">Slap Shots</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Notifications */}
          <DashboardCard
            title="Notifications"
            icon={<BellRing size={20} />}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-hockey-slate">
                      Victor Hedman (D) - Questionable
                    </div>
                    <div className="text-sm text-hockey-light-slate">
                      May not play against NYR due to lower body injury
                    </div>
                    <div className="text-xs text-hockey-light-slate mt-1">
                      2 hours ago
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-hockey-slate">
                      League Rankings Updated
                    </div>
                    <div className="text-sm text-hockey-light-slate">
                      Your team moved up 2 spots to 3rd place
                    </div>
                    <div className="text-xs text-hockey-light-slate mt-1">
                      Yesterday
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Index;
