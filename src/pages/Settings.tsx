
import React from 'react';
import { Settings as SettingsIcon, Users, Calendar, Trophy, Bell, Clock, Lock, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-hockey-blue">League Settings</span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-hockey-slate">Northern Ice Breakers</h1>
        <p className="text-hockey-light-slate max-w-2xl">
          Customize your league settings, notification preferences, and more.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <SettingsIcon size={20} className="text-hockey-blue mr-2" />
              <h2 className="text-xl font-display font-semibold text-hockey-slate">League Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="league-name" className="block text-sm font-medium text-hockey-slate mb-1">League Name</label>
                  <input 
                    id="league-name" 
                    type="text" 
                    defaultValue="Northern Ice Breakers"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="league-type" className="block text-sm font-medium text-hockey-slate mb-1">League Type</label>
                  <select 
                    id="league-type" 
                    defaultValue="points"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  >
                    <option value="points">Points League</option>
                    <option value="h2h">Head-to-Head</option>
                    <option value="roto">Rotisserie</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="teams" className="block text-sm font-medium text-hockey-slate mb-1">Number of Teams</label>
                  <input 
                    id="teams" 
                    type="number" 
                    defaultValue="8"
                    min="4"
                    max="16"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="season" className="block text-sm font-medium text-hockey-slate mb-1">Season</label>
                  <select 
                    id="season" 
                    defaultValue="2023-2024"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  >
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                    <option value="2021-2022">2021-2022</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="commissioner" className="block text-sm font-medium text-hockey-slate mb-1">Commissioner</label>
                  <input 
                    id="commissioner" 
                    type="text" 
                    defaultValue="Emily Johnson"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <label htmlFor="public-league" className="block text-sm font-medium text-hockey-slate mb-1">Public League</label>
                    <p className="text-xs text-hockey-light-slate">Make this league visible to everyone</p>
                  </div>
                  <Switch id="public-league" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calendar size={20} className="text-hockey-blue mr-2" />
              <h2 className="text-xl font-display font-semibold text-hockey-slate">Schedule Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="matchup-period" className="block text-sm font-medium text-hockey-slate mb-1">Matchup Period</label>
                  <select 
                    id="matchup-period" 
                    defaultValue="weekly"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="weeks-per-matchup" className="block text-sm font-medium text-hockey-slate mb-1">Weeks Per Matchup</label>
                  <input 
                    id="weeks-per-matchup" 
                    type="number" 
                    defaultValue="1"
                    min="1"
                    max="4"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="regular-season" className="block text-sm font-medium text-hockey-slate mb-1">Regular Season Length</label>
                  <input 
                    id="regular-season" 
                    type="number" 
                    defaultValue="20"
                    min="10"
                    max="24"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                  <p className="text-xs text-hockey-light-slate mt-1">Number of matchup periods in the regular season</p>
                </div>
                
                <div>
                  <label htmlFor="playoff-teams" className="block text-sm font-medium text-hockey-slate mb-1">Playoff Teams</label>
                  <input 
                    id="playoff-teams" 
                    type="number" 
                    defaultValue="4"
                    min="2"
                    max="8"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="scoring" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Trophy size={20} className="text-hockey-blue mr-2" />
              <h2 className="text-xl font-display font-semibold text-hockey-slate">Points Scoring Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-hockey-slate mb-3">Skater Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-hockey-slate mb-1">Goals</label>
                    <div className="flex items-center">
                      <input 
                        id="goals" 
                        type="number" 
                        defaultValue="3"
                        min="0"
                        max="10"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="assists" className="block text-sm font-medium text-hockey-slate mb-1">Assists</label>
                    <div className="flex items-center">
                      <input 
                        id="assists" 
                        type="number" 
                        defaultValue="2"
                        min="0"
                        max="10"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="ppp" className="block text-sm font-medium text-hockey-slate mb-1">Power Play Points</label>
                    <div className="flex items-center">
                      <input 
                        id="ppp" 
                        type="number" 
                        defaultValue="1"
                        min="0"
                        max="10"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="shp" className="block text-sm font-medium text-hockey-slate mb-1">Shorthanded Points</label>
                    <div className="flex items-center">
                      <input 
                        id="shp" 
                        type="number" 
                        defaultValue="1.5"
                        min="0"
                        max="10"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="gwg" className="block text-sm font-medium text-hockey-slate mb-1">Game-Winning Goals</label>
                    <div className="flex items-center">
                      <input 
                        id="gwg" 
                        type="number" 
                        defaultValue="1"
                        min="0"
                        max="10" 
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="sog" className="block text-sm font-medium text-hockey-slate mb-1">Shots on Goal</label>
                    <div className="flex items-center">
                      <input 
                        id="sog" 
                        type="number" 
                        defaultValue="0.5"
                        min="0"
                        max="10"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="hits" className="block text-sm font-medium text-hockey-slate mb-1">Hits</label>
                    <div className="flex items-center">
                      <input 
                        id="hits" 
                        type="number" 
                        defaultValue="0.2"
                        min="0"
                        max="10"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="blocks" className="block text-sm font-medium text-hockey-slate mb-1">Blocked Shots</label>
                    <div className="flex items-center">
                      <input 
                        id="blocks" 
                        type="number" 
                        defaultValue="0.5"
                        min="0"
                        max="10"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="fow" className="block text-sm font-medium text-hockey-slate mb-1">Faceoffs Won</label>
                    <div className="flex items-center">
                      <input 
                        id="fow" 
                        type="number" 
                        defaultValue="0.1"
                        min="0"
                        max="10"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium text-hockey-slate mb-3">Goalie Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="wins" className="block text-sm font-medium text-hockey-slate mb-1">Wins</label>
                    <div className="flex items-center">
                      <input 
                        id="wins" 
                        type="number" 
                        defaultValue="4"
                        min="0"
                        max="10"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="losses" className="block text-sm font-medium text-hockey-slate mb-1">Losses</label>
                    <div className="flex items-center">
                      <input 
                        id="losses" 
                        type="number" 
                        defaultValue="-1"
                        min="-10"
                        max="0"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="saves" className="block text-sm font-medium text-hockey-slate mb-1">Saves</label>
                    <div className="flex items-center">
                      <input 
                        id="saves" 
                        type="number" 
                        defaultValue="0.2"
                        min="0"
                        max="10"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="ga" className="block text-sm font-medium text-hockey-slate mb-1">Goals Against</label>
                    <div className="flex items-center">
                      <input 
                        id="ga" 
                        type="number" 
                        defaultValue="-1"
                        min="-10"
                        max="0"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="shutouts" className="block text-sm font-medium text-hockey-slate mb-1">Shutouts</label>
                    <div className="flex items-center">
                      <input 
                        id="shutouts" 
                        type="number" 
                        defaultValue="4"
                        min="0"
                        max="10"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="otl" className="block text-sm font-medium text-hockey-slate mb-1">Overtime Losses</label>
                    <div className="flex items-center">
                      <input 
                        id="otl" 
                        type="number" 
                        defaultValue="1"
                        min="-5"
                        max="5"
                        step="0.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-sm text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Lock size={20} className="text-hockey-blue mr-2" />
              <h2 className="text-xl font-display font-semibold text-hockey-slate">Advanced Scoring Options</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Negative Points</h3>
                  <p className="text-xs text-hockey-light-slate">Allow categories to have negative values</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Fractional Points</h3>
                  <p className="text-xs text-hockey-light-slate">Allow point values to include decimals</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Bonus Points</h3>
                  <p className="text-xs text-hockey-light-slate">Award bonus points for exceptional performances</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-medium text-hockey-slate">Performance Bonuses</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div>
                      <h4 className="text-sm text-hockey-slate">Hat Trick</h4>
                      <p className="text-xs text-hockey-light-slate">3+ goals in a game</p>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        defaultValue="3"
                        min="0"
                        max="10"
                        className="w-16 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-xs text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div>
                      <h4 className="text-sm text-hockey-slate">Playmaker</h4>
                      <p className="text-xs text-hockey-light-slate">3+ assists in a game</p>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        defaultValue="3"
                        min="0"
                        max="10"
                        className="w-16 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                      />
                      <span className="ml-2 text-xs text-hockey-light-slate">pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="roster" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Users size={20} className="text-hockey-blue mr-2" />
              <h2 className="text-xl font-display font-semibold text-hockey-slate">Roster Positions</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="centers" className="block text-sm font-medium text-hockey-slate mb-1">Centers (C)</label>
                  <input 
                    id="centers" 
                    type="number" 
                    defaultValue="2"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="lw" className="block text-sm font-medium text-hockey-slate mb-1">Left Wings (LW)</label>
                  <input 
                    id="lw" 
                    type="number" 
                    defaultValue="2"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="rw" className="block text-sm font-medium text-hockey-slate mb-1">Right Wings (RW)</label>
                  <input 
                    id="rw" 
                    type="number" 
                    defaultValue="2"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="defense" className="block text-sm font-medium text-hockey-slate mb-1">Defensemen (D)</label>
                  <input 
                    id="defense" 
                    type="number" 
                    defaultValue="4"
                    min="0"
                    max="8"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="goalies" className="block text-sm font-medium text-hockey-slate mb-1">Goalies (G)</label>
                  <input 
                    id="goalies" 
                    type="number" 
                    defaultValue="2"
                    min="0"
                    max="3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="utility" className="block text-sm font-medium text-hockey-slate mb-1">Utility (UTIL)</label>
                  <input 
                    id="utility" 
                    type="number" 
                    defaultValue="2"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="bench" className="block text-sm font-medium text-hockey-slate mb-1">Bench (BN)</label>
                  <input 
                    id="bench" 
                    type="number" 
                    defaultValue="5"
                    min="0"
                    max="10"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="ir" className="block text-sm font-medium text-hockey-slate mb-1">Injured Reserve (IR)</label>
                  <input 
                    id="ir" 
                    type="number" 
                    defaultValue="2"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium text-hockey-slate mb-2">Total Roster Size: 21</h3>
                <p className="text-xs text-hockey-light-slate">The sum of all roster positions excluding IR spots</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Clock size={20} className="text-hockey-blue mr-2" />
              <h2 className="text-xl font-display font-semibold text-hockey-slate">Roster Management</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="acquisition-limit" className="block text-sm font-medium text-hockey-slate mb-1">Weekly Acquisition Limit</label>
                <input 
                  id="acquisition-limit" 
                  type="number" 
                  defaultValue="7"
                  min="0"
                  max="20"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                />
                <p className="text-xs text-hockey-light-slate mt-1">Maximum player acquisitions per week (0 for no limit)</p>
              </div>
              
              <div>
                <label htmlFor="min-games" className="block text-sm font-medium text-hockey-slate mb-1">Minimum Games Played</label>
                <input 
                  id="min-games" 
                  type="number" 
                  defaultValue="3"
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hockey-blue/30 focus:border-hockey-blue"
                />
                <p className="text-xs text-hockey-light-slate mt-1">Minimum number of games required per matchup period</p>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Allow Same-Day Roster Changes</h3>
                  <p className="text-xs text-hockey-light-slate">Enable lineup changes on the same day a game is played</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Allow Dropping Players on Bench</h3>
                  <p className="text-xs text-hockey-light-slate">Players on bench can be dropped</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Bell size={20} className="text-hockey-blue mr-2" />
              <h2 className="text-xl font-display font-semibold text-hockey-slate">Notification Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Matchup Reminders</h3>
                  <p className="text-xs text-hockey-light-slate">Get reminded before your matchups begin</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Player Status Updates</h3>
                  <p className="text-xs text-hockey-light-slate">Receive updates when your players' status changes</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">League Transactions</h3>
                  <p className="text-xs text-hockey-light-slate">Get notified about trades and waiver claims</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Scoring Updates</h3>
                  <p className="text-xs text-hockey-light-slate">Get real-time updates on your team's scoring</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">Commissioner Announcements</h3>
                  <p className="text-xs text-hockey-light-slate">Receive notifications about league announcements</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-hockey-slate">League Chat Messages</h3>
                  <p className="text-xs text-hockey-light-slate">Get notified about new messages in the league chat</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button className="bg-hockey-blue hover:bg-hockey-dark-blue">
          <Save size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
