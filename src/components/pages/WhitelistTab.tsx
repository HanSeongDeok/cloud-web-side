import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import type {
  WhitelistCollection,
  WhitelistGroup,
  NewWhitelistGroup,
  UpdateWhitelistGroup,
} from "@/types/whitelist";
import {
  getWhitelistCollection,
  deleteGroup,
  addGroup,
  updateGroup,
  promoteAdmin,
  demoteAdmin,
  RevokeUserPermission,
} from "@/handlers/services/whitelist.service.handler";
import { useAlert } from "@/hooks/useAlert";
import AlertModal from "@/components/ui/AlertModal";
import TeamEditModal from "../whitelist-team/TeamEditModal";
import WhitelistTeamList from "../whitelist-team/WhitelistTeamList";
import WhitelistTeamHeader from "../whitelist-team/WhitelistTeamHeader";

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

  const { showConfirm, showError, isOpen, config, hideAlert } = useAlert();
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
      toast.success("팀이 성공적으로 삭제되었습니다.", {
        duration: 3000,
      });
    } catch (error) {
      console.error("팀 삭제 실패:", error);
      showError(
        "팀 삭제 실패",
        `팀 삭제에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };
  //TODO : 유저 삭제 시에도 알림 모달 뜨도록 UI feedback 추가 필요
  const handleDeleteUser = useCallback(
    async (userId: number) => {
      try {
        const updatedData = await RevokeUserPermission(userId);
        setWhitelistData(updatedData);
        // 업데이트된 데이터의 모든 그룹을 펼쳐진 상태로 유지
        const allGroupIds = new Set(
          updatedData.groups.map((group) => group.id)
        );
        setExpandedGroups(allGroupIds);
        toast.success("사용자가 성공적으로 권한이 회수되었습니다.", {
          duration: 3000,
        });
      } catch (error) {
        console.error("사용자 권한 회수 실패:", error);
        showError(
          "사용자 권한 회수 실패",
          `사용자 권한 회수에 실패했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      }
    },
    [showError]
  );

  const handleConfirmDeleteTeam = useCallback(
    (groupId: number, groupName: string) => {
      showConfirm(
        "그룹 삭제 안내 ",
        `${groupName}\n 해당 그룹을 화이트리스트에서 제거하시겠습니까? \n 일반 팀의 경우 하위에 포함된 유저의 권한도 함께 해제됩니다. `,
        () => handleDeleteTeam(groupId),
        "warning"
      );
    },
    [showConfirm, handleDeleteTeam]
  );

  const handleConfirmDeleteUser = useCallback(
    (userId: number, userName: string) => {
      showConfirm(
        "유저 권한 해제 안내",
        `${userName}\n 유저를 화이트리스트 권한을 해제하시겠습니까? \n(마지막 유저를 삭제하는 경우, 해당 그룹도 함께 삭제됩니다.)`,
        () => handleDeleteUser(userId),
        "warning"
      );
    },
    [showConfirm, handleDeleteUser]
  );

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
      //         ? { ...user, role: "ADMIN" as UserRole }
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
      //         ? { ...user, role: "USER" as UserRole }
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
  const filteredGroups = useMemo(() => {
    return whitelistData.groups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.users.some(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        group.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [whitelistData.groups, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <WhitelistTeamHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={loadWhitelistData}
        onAddTeam={handleOpenTeamModal}
        loading={loading}
      />
      <WhitelistTeamList
        filteredGroups={filteredGroups}
        expandedGroups={expandedGroups}
        onToggleTeamExpansion={toggleTeamExpansion}
        onOpenTeamModal={handleOpenTeamModal}
        onDeleteTeam={handleConfirmDeleteTeam}
        onDeleteUser={handleConfirmDeleteUser}
        onPromoteUser={handlePromoteUser}
        onDemoteUser={handleDemoteUser}
      />

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
