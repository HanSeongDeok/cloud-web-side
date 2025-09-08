import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Users,
  Mail,
  User,
  Crown,
  UserCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { WhitelistGroup } from "@/types/whitelist";
import { cn } from "@/lib/utils";

interface WhitelistTeamListProps {
  filteredGroups: WhitelistGroup[];
  expandedGroups: Set<number>;
  onToggleTeamExpansion: (groupId: number) => void;
  onOpenTeamModal: (group: WhitelistGroup) => void;
  onDeleteTeam: (groupId: number, groupName: string) => void;
  onDeleteUser: (userId: number, userName: string) => void;
  onPromoteUser: (userId: number, userName: string) => void;
  onDemoteUser: (userId: number, userName: string) => void;
}

const WhitelistTeamList: React.FC<WhitelistTeamListProps> = ({
  filteredGroups,
  expandedGroups,
  onToggleTeamExpansion,
  onOpenTeamModal,
  onDeleteTeam,
  onDeleteUser,
  onPromoteUser,
  onDemoteUser,
}) => {
  if (filteredGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-500">다른 검색어로 시도해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm max-h-[40rem] overflow-y-auto">
      {filteredGroups.map((group) => (
        <div
          key={group.id}
          className="border-b border-gray-200 last:border-b-0"
        >
          {/* Team Header */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onToggleTeamExpansion(group.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {expandedGroups.has(group.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-semibold text-gray-900">
                  {group.name}
                </span>
                <span className="ml-6 text-sm text-gray-500">
                  #{group.code}
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  ({group.users.length}명)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                title="그룹 수정"
                onClick={() => onOpenTeamModal(group)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                title="그룹 삭제"
                onClick={() => onDeleteTeam(group.id, group.name)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Team Members */}
          {expandedGroups.has(group.id) && (
            <div className="bg-gray-50">
              {group.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 px-4 pl-16 hover:bg-gray-100 border-t border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-green-600" />
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        #{user.employeeId}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {user.team}
                      </span>
                    </div>
                  </div>
                  {user.role !== "SUPER_ADMIN" ? (
                    <div className="flex items-center space-x-14">
                      <Select
                        value={user.role || "USER"}
                        onValueChange={(newRole) => {
                          if (newRole === "ADMIN" && user.role !== "ADMIN") {
                            onPromoteUser(user.id, user.name);
                          } else if (
                            newRole === "USER" &&
                            user.role === "ADMIN"
                          ) {
                            onDemoteUser(user.id, user.name);
                          }
                        }}
                      >
                        {/* TODO 해당 Selecter가 '마스터 관리자'일 때만 활성화되도록 해야함*/}
                        <SelectTrigger
                          size="sm"
                          className={cn(
                            "w-35 rounded-full transition-all duration-200 text-xs", // 세로폭(h) 줄이고 글씨 크기(text-xs)도 줄임
                            user.role === "ADMIN"
                              ? "border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-400 hover:bg-orange-100"
                              : "border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100"
                          )}
                        >
                          <div className="flex items-center space-x-1">
                            {user.role === "ADMIN" ? (
                              <>
                                <UserCheck className="w-3 h-3" />{" "}
                                {/* 아이콘도 작게 */}
                                <span className="text-xs">서브 관리자</span>
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3" />
                                <span className="text-xs">사용자</span>
                              </>
                            )}
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="ADMIN">
                            <div className="flex items-center space-x-2">
                              <UserCheck className="w-4 h-4" />
                              <span>서브 관리자</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="USER">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>사용자</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        title="삭제"
                        onClick={() => onDeleteUser(user.id, user.name)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-14">
                      <div className="flex items-center space-x-2 w-35 h-8 px-3 py-2 rounded-full border border-purple-300 bg-purple-50 text-purple-700">
                        <Crown className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          마스터 관리자
                        </span>
                      </div>
                      <div className="w-6"></div> {/* 삭제 버튼 공간 확보 */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WhitelistTeamList;
