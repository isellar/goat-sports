
import React from 'react';
import { Search } from 'lucide-react';

interface RosterSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const RosterSearch: React.FC<RosterSearchProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hockey-light-slate dark:text-hockey-ice/60" size={18} />
      <input
        type="text"
        placeholder="Search by player name, team, or position..."
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-hockey-slate bg-white dark:bg-hockey-slate/40 dark:border-hockey-slate/60 dark:text-hockey-ice focus:outline-none focus:ring-2 focus:ring-hockey-blue/20 focus:border-hockey-blue/30"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default RosterSearch;
