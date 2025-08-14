import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  User,
  RotateCcw,
  Crown,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type {
  WhitelistCollection,
  WhitelistGroup,
  NewWhitelistGroup,
  UpdateWhitelistGroup,
} from "@/types/whitelist";
import {
  getWhitelistCollection,
  deleteGroup,
  deleteUser,
  addGroup,
  updateGroup,
  promoteAdmin,
  demoteAdmin,
} from "@/handlers/services/whitelist.service.handler";
import { useAlert } from "@/hooks/useAlert";
import { cn } from "@/lib/utils";
import AlertModal from "@/components/ui/AlertModal";
import TeamEditModal from "../whitelist-team/TeamEditModal";

const WhitelistTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [whitelistData, setWhitelistData] = useState<WhitelistCollection>({
    groups: [],
  });
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  // 모달 관련 상태
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<WhitelistGroup | null>(null);
  //커스텀 훅 - 구조 분해 할당으로 필요 함수만 추출
  const { showError, isOpen, config, hideAlert } = useAlert();

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWhitelistCollection();
        setWhitelistData(data);
        // 모든 그룹을 초기에 펼쳐진 상태로 설정
        const allGroupIds = new Set(data.groups.map((group) => group.id));
        setExpandedGroups(allGroupIds);
        toast.success(`${data.groups.length}개 팀 데이터 로드 완료`, {
          duration: 2000, // 2초 후 자동 사라짐
        });
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        showError(
          "데이터 로딩 실패",
          `데이터 로딩에 실패했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showError]);
  /**
   * ==========================
   *   whitelist 팀구조 관련 핸들러
   * ==========================
   *
   * 이 영역은 화이트리스트 팀 구조 관련 상태 및 동작을 담당합니다.
   * - 화이트리스트 데이터의 조회, 추가, 수정, 삭제 등 CRUD 로직을 포함합니다.
   * - 각 함수는 서버와의 통신 및 상태 업데이트를 수행합니다.
   * - 주요 함수:
   *   - loadWhitelistData: 화이트리스트 전체 데이터를 서버에서 불러와 상태 업데이트
   *   - toggleTeamExpansion: 그룹별 펼침/접기 상태를 토글하여 UI 표시 제어
   *   - handleOpenTeamModal: 팀 모달 열기 (추가/편집 통합) - group 파라미터 유무에 따라 모드 결정
   *   - handleAddTeam: 새로운 팀 그룹을 추가하는 기능 성공 시, 전체 데이터 새로고침
   *   - handleUpdateTeam: 팀 그룹을 수정하는 기능 성공 시, 전체 데이터 새로고침
   *   - handleDeleteTeam: 특정 팀 그룹을 삭제하는 기능, 성공 시 전체 데이터 새로고침
   *   - handleDeleteUser: 사용자를 삭제(권한 회수)하는 기능, 성공 시 전체 데이터 새로고침
   *   - handlePromoteUser: 사용자를 서브 관리자로 승격시키는 기능, 실패 시 데이터 새로고침
   *   - handleDemoteUser: 서브 관리자를 일반 사용자로 강등시키는 기능, 실패 시 데이터 새로고침
   *   - filteredGroups: 검색어에 따라 필터링된 그룹 목록
   */
  //TODO : 그룹삭제 및 사용자 삭제 모달 추가 필요
  const loadWhitelistData = async () => {
    setLoading(true);
    try {
      const data = await getWhitelistCollection();
      setWhitelistData(data);
      // 새로고침 시에도 모든 그룹을 펼쳐진 상태로 설정
      const allGroupIds = new Set(data.groups.map((group) => group.id));
      setExpandedGroups(allGroupIds);
      toast.success(`${data.groups.length}개 팀 데이터 새로고침 완료`, {
        duration: 2000, // 2초 후 자동 사라짐
      });
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      showError(
        "데이터 로딩 실패",
        `데이터 로딩에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTeamExpansion = (groupId: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleOpenTeamModal = (group?: WhitelistGroup) => {
    setEditingTeam(group || null);
    setTeamModalOpen(true);
  };

  const handleAddTeam = async (groupData: NewWhitelistGroup) => {
    try {
      const updatedData = await addGroup(groupData);
      setWhitelistData(updatedData);
      const allGroupIds = new Set(updatedData.groups.map((group) => group.id));
      setExpandedGroups(allGroupIds);
      toast.success("새로운 팀이 성공적으로 추가되었습니다.", {
        duration: 3000, // 3초 후 자동 사라짐
      });
      setTeamModalOpen(false);
    } catch (error) {
      console.error("팀 추가 실패:", error);
      showError(
        "팀 추가 실패",
        `팀 추가에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  const handleUpdateTeam = async (
    groupId: number,
    groupData: UpdateWhitelistGroup
  ) => {
    try {
      const updatedData = await updateGroup(groupId, groupData);
      setWhitelistData(updatedData);
      const allGroupIds = new Set(updatedData.groups.map((group) => group.id));
      setExpandedGroups(allGroupIds);
      toast.success("팀 정보가 성공적으로 수정되었습니다.", {
        duration: 3000, // 3초 후 자동 사라짐
      });
      setTeamModalOpen(false);
    } catch (error) {
      console.error("팀 수정 실패:", error);
      showError(
        "팀 수정 실패",
        `팀 수정에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  const handleDeleteTeam = async (groupId: number) => {
    try {
      const updatedData = await deleteGroup(groupId);
      setWhitelistData(updatedData);
      // 업데이트된 데이터의 모든 그룹을 펼쳐진 상태로 유지
      const allGroupIds = new Set(updatedData.groups.map((group) => group.id));
      setExpandedGroups(allGroupIds);
      toast.success("그룹이 성공적으로 삭제되었습니다.", {
        duration: 3000,
      });
    } catch (error) {
      console.error("그룹 삭제 실패:", error);
      showError(
        "그룹 삭제 실패",
        `그룹 삭제에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const updatedData = await deleteUser(userId);
      setWhitelistData(updatedData);
      // 업데이트된 데이터의 모든 그룹을 펼쳐진 상태로 유지
      const allGroupIds = new Set(updatedData.groups.map((group) => group.id));
      setExpandedGroups(allGroupIds);
      toast.success("사용자가 성공적으로 삭제되었습니다.", {
        duration: 3000,
      });
    } catch (error) {
      console.error("사용자 삭제 실패:", error);
      showError(
        "사용자 삭제 실패",
        `사용자 삭제에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  const handlePromoteUser = async (userId: number, userName: string) => {
    try {
      // TODO: 실제 API 호출 구현 필요
      await promoteAdmin([userId]);
      await loadWhitelistData();
      // 임시로 로컬 상태 업데이트 (실제 API 연결 전까지)
      // setWhitelistData((prev) => ({
      //   ...prev,
      //   groups: prev.groups.map((group) => ({
      //     ...group,
      //     users: group.users.map((user) =>
      //       user.id === userId
      //         ? { ...user, role: "ROLE_ADMIN" as UserRole }
      //         : user
      //     ),
      //   })),
      // }));

      toast.success(`${userName}님이 서브 관리자로 승격되었습니다.`, {
        duration: 3000,
      });
    } catch (error) {
      console.error("사용자 승격 실패:", error);
      // 실패 시 데이터 새로고침으로 원상태 복구
      await loadWhitelistData();
      showError(
        "사용자 승격 실패",
        `사용자 승격에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  const handleDemoteUser = async (userId: number, userName: string) => {
    try {
      // TODO: 실제 API 호출 구현 필요
      await demoteAdmin([userId]);
      await loadWhitelistData();
      // 임시로 로컬 상태 업데이트 (실제 API 연결 전까지)
      // setWhitelistData((prev) => ({
      //   ...prev,
      //   groups: prev.groups.map((group) => ({
      //     ...group,
      //     users: group.users.map((user) =>
      //       user.id === userId
      //         ? { ...user, role: "ROLE_USER" as UserRole }
      //         : user
      //     ),
      //   })),
      // }));

      toast.success(`${userName}님이 일반 사용자로 변경되었습니다.`, {
        duration: 3000,
      });
    } catch (error) {
      console.error("사용자 강등 실패:", error);
      // 실패 시 데이터 새로고침으로 원상태 복구
      await loadWhitelistData();
      showError(
        "사용자 강등 실패",
        `사용자 강등에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };
  // 팀명, 팀 코드 , 사용자 이름, 이메일 에 대해서 대응
  const filteredGroups = whitelistData.groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.users.some(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4 flex-1 mr-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="전체 검색..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadWhitelistData}
            disabled={loading}
            className="bg-gray-600 text-white px-3 py-3 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => handleOpenTeamModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>팀 코드 등록</span>
          </button>
        </div>
      </div>

      {/* Teams List */}
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
                  onClick={() => toggleTeamExpansion(group.id)}
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
              <div
                className="flex items-center space-x-4
              "
              >
                <button
                  onClick={() => handleOpenTeamModal(group)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTeam(group.id)}
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
                    {user.role !== "ROLE_SUPER_ADMIN" ? (
                      <div className="flex items-center space-x-14">
                        <Select
                          value={user.role || "ROLE_USER"}
                          onValueChange={(newRole) => {
                            if (
                              newRole === "ROLE_ADMIN" &&
                              user.role !== "ROLE_ADMIN"
                            ) {
                              handlePromoteUser(user.id, user.name);
                            } else if (
                              newRole === "ROLE_USER" &&
                              user.role === "ROLE_ADMIN"
                            ) {
                              handleDemoteUser(user.id, user.name);
                            }
                          }}
                        >
                          {/* TODO 해당 Selecter가 '마스터 관리자'일 때만 활성화되도록 해야함*/}
                          <SelectTrigger
                            size="sm"
                            className={cn(
                              "w-35 rounded-full transition-all duration-200 text-xs", // 세로폭(h) 줄이고 글씨 크기(text-xs)도 줄임
                              user.role === "ROLE_ADMIN"
                                ? "border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-400 hover:bg-orange-100"
                                : "border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100"
                            )}
                          >
                            <div className="flex items-center space-x-1">
                              {user.role === "ROLE_ADMIN" ? (
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
                            <SelectItem value="ROLE_ADMIN">
                              <div className="flex items-center space-x-2">
                                <UserCheck className="w-4 h-4" />
                                <span>서브 관리자</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="ROLE_USER">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>사용자</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-500">다른 검색어로 시도해보세요.</p>
        </div>
      )}

      <TeamEditModal
        editingItem={editingTeam}
        isOpen={teamModalOpen}
        onClose={() => {
          setTeamModalOpen(false);
          setEditingTeam(null);
        }}
        onEditTeam={setEditingTeam}
        onCreateTeam={handleAddTeam}
        onUpdateTeam={handleUpdateTeam}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={isOpen}
        onClose={hideAlert}
        type={config.type}
        title={config.title}
        message={config.message}
        confirmText={config.confirmText}
        onConfirm={config.onConfirm}
        showCancel={config.showCancel}
        cancelText={config.cancelText}
      />
    </div>
  );
};

export default WhitelistTab;
