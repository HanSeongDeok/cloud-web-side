import { RotateCcw, Search } from "lucide-react";

type WhitelistRequestHeaderProps = {
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  handleConfirmApprove: () => void;
  handleConfirmReject: () => void;
  isButtonDisabled: () => boolean;
  loading: boolean;
};

const WhitelistRequestHeader: React.FC<WhitelistRequestHeaderProps> = ({
  onRefresh,
  searchTerm,
  onSearchChange,
  handleConfirmApprove,
  handleConfirmReject,
  isButtonDisabled,
  loading = false,
}) => {
  return (
    <div className="flex gap-4 mb-4 items-center">
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

      {/* 새로고침 버튼 - 정사각형으로 조정 */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        title="새로고침"
      >
        <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      </button>

      {/* 승인/거절 버튼들 - 높이 통일 */}
      <button
        onClick={handleConfirmApprove}
        disabled={isButtonDisabled()}
        className="px-4 py-2 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
      >
        선택 항목 승인
      </button>
      <button
        onClick={handleConfirmReject}
        disabled={isButtonDisabled()}
        className="px-4 py-2 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
      >
        선택 항목 거절
      </button>
    </div>
  );
};

export default WhitelistRequestHeader;
