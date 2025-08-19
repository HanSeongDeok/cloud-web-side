import React from "react";
import { Search, Plus, RotateCcw } from "lucide-react";

interface WhitelistTeamHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onAddTeam: () => void;
  loading?: boolean;
}

const WhitelistTeamHeader: React.FC<WhitelistTeamHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onAddTeam,
  loading = false,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4 flex-1 mr-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="전체 검색..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-gray-600 text-white px-3 py-3 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={onAddTeam}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>팀 코드 등록</span>
        </button>
      </div>
    </div>
  );
};

export default WhitelistTeamHeader;
