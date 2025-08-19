import type { PermissionRequests } from "@/types/whitelist";
import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  approvePermissionRequests,
  getPermissionRequests,
  rejectPermissionRequests,
} from "@/handlers/services/whitelist.service.handler";
import type { AgGridReact } from "node_modules/ag-grid-react/dist/types/src/agGridReact";
import { useAlert } from "@/hooks/useAlert";
import WhitelistRequestHeader from "../whitelist-requests/WhitelistRequestHeader";
import WhitelistRequestList from "../whitelist-requests/WhitelistRequestList";
import AlertModal from "@/components/ui/AlertModal";

const WhitelistRequestsTab: React.FC = () => {
  //상태 선언
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState<PermissionRequests>({
    requests: [],
  });

  const alertModal = useAlert();
  const { showConfirm } = alertModal;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 200);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // AG-Grid ref로 직접 접근
  const gridRef = useRef<AgGridReact>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPermissionRequests();
      setRequestData(data);
      toast.success(`${data.requests.length}개 권한 요청 데이터 로드 완료`, {
        duration: 2000,
      });
    } catch (error) {
      console.error("권한 요청 데이터 로딩 실패:", error);
      toast.error(
        `권한 요청 데이터 로딩에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
        {
          duration: 4000,
        }
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // 검색 상태 - 디바운스된 검색어 사용
  const filtered = useMemo(() => {
    const q = debouncedSearchTerm.trim().toLowerCase();
    if (!q) return requestData.requests;
    return requestData.requests.filter((request) => {
      return (
        request.name.toLowerCase().includes(q) ||
        request.employeeId.toLowerCase().includes(q) ||
        request.email.toLowerCase().includes(q) ||
        request.team.toLowerCase().includes(q)
      );
    });
  }, [requestData.requests, debouncedSearchTerm]);

  const isButtonDisabled = useCallback(() => {
    return selectedRows.length === 0;
  }, [selectedRows]);

  // 선택 변경 핸들러
  const onSelectionChanged = useCallback(() => {
    const currentSelectedRows = gridRef.current?.api?.getSelectedRows() || [];
    console.log("선택된 행들:", currentSelectedRows);
    setSelectedRows(currentSelectedRows.map((row) => row.id));
  }, []);

  /**
   * ==========================
   *   whitelist 권한요청 관련 핸들러
   * ==========================
   *
   * 핵심 API 호출 함수들 (실제 비즈니스 로직 & api 서비스 핸들러 호출)
   * 확인 모달 함수들 (핵심 함수 호출)
   *
   * 📋 함수 목록:
   *   handleAcceptSelected(): 선택된 여러 항목 일괄 승인 처리
   *   handleRejectSelected(): 선택된 여러 항목 일괄 거절 처리
   *   handleAcceptSingle(id): 단일 항목 승인 처리
   *   handleRejectSingle(id): 단일 항목 거절 처리
   *   handleConfirmSelectedApprove(): 일괄 승인 확인 모달 표시
   *   handleConfirmSelectedReject(): 일괄 거절 확인 모달 표시
   *   handleConfirmSingleApprove(id): 단일 승인 확인 모달 표시
   *   handleConfirmSingleReject(id): 단일 거절 확인 모달 표시
   *
   * 메시지 패턴:
   *   성공: toast.success() 사용 (2-3초 자동 사라짐)
   *   에러: toast.error() 사용 (4초 자동 사라짐)
   *   확인: showConfirm() 사용 (확인/취소 모달)
   */

  const handleAcceptSelected = useCallback(async () => {
    if (selectedRows.length === 0) return;

    try {
      await approvePermissionRequests(selectedRows);
      setRequestData((prev) => ({
        ...prev,
        requests: prev.requests.filter((r) => !selectedRows.includes(r.id)),
      }));
      setSelectedRows([]); // 성공 시 선택 초기화
      toast.success(`${selectedRows.length}개 권한 요청이 승인되었습니다.`, {
        duration: 3000,
      });
    } catch (e: unknown) {
      alertModal.hideAlert();
      await loadRequests();
      console.error("승인 처리 중 오류:", e);
      toast.error(
        `승인 처리 중 오류가 발생했습니다. ${
          e instanceof Error ? e.message : "알 수 없는 오류"
        }`,
        {
          duration: 4000,
        }
      );
    }
  }, [selectedRows, alertModal, loadRequests]);

  const handleRejectSelected = useCallback(async () => {
    if (selectedRows.length === 0) return;

    try {
      await rejectPermissionRequests(selectedRows);
      setRequestData((prev) => ({
        ...prev,
        requests: prev.requests.filter((r) => !selectedRows.includes(r.id)),
      }));
      setSelectedRows([]); // 성공 시 선택 초기화
      toast.success(`${selectedRows.length}개 권한 요청이 거절되었습니다.`, {
        duration: 3000,
      });
    } catch (e: unknown) {
      alertModal.hideAlert();
      await loadRequests();
      console.error("거절 처리 중 오류:", e);
      toast.error(
        `거절 처리 중 오류가 발생했습니다. ${
          e instanceof Error ? e.message : "알 수 없는 오류"
        }`,
        {
          duration: 4000,
        }
      );
    }
  }, [selectedRows, alertModal, loadRequests]);

  const handleAcceptSingle = useCallback(
    async (id: number) => {
      try {
        await approvePermissionRequests([id]);
        setRequestData((prev) => ({
          ...prev,
          requests: prev.requests.filter((r) => r.id !== id),
        }));
        toast.success("권한 요청이 승인되었습니다.", {
          duration: 3000,
        });
      } catch (error) {
        alertModal.hideAlert();
        await loadRequests();
        console.error("권한 승인 실패:", error);
        toast.error(
          `권한 승인에 실패했습니다. ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`,
          {
            duration: 4000,
          }
        );
      }
    },
    [alertModal, loadRequests]
  );

  const handleRejectSingle = useCallback(
    async (id: number) => {
      try {
        await rejectPermissionRequests([id]);
        setRequestData((prev) => ({
          ...prev,
          requests: prev.requests.filter((r) => r.id !== id),
        }));
        toast.success("권한 요청이 거절되었습니다.", {
          duration: 3000,
        });
      } catch (error) {
        alertModal.hideAlert();
        await loadRequests();
        console.error("권한 거절 실패:", error);
        toast.error(
          `권한 거절에 실패했습니다. ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`,
          {
            duration: 4000,
          }
        );
      }
    },
    [alertModal, loadRequests]
  );

  const handleConfirmSelectedApprove = useCallback(() => {
    showConfirm(
      "승인 확인",
      `선택된 ${selectedRows.length}개의 권한 요청을 승인하시겠습니까?\n승인된 사용자는 즉시 화이트리스트에 추가됩니다.`,
      handleAcceptSelected,
      "info"
    );
  }, [selectedRows.length, showConfirm, handleAcceptSelected]);

  const handleConfirmSelectedReject = useCallback(() => {
    showConfirm(
      "거절 확인",
      `선택된 ${selectedRows.length}개의 권한 요청을 거절하시겠습니까?\n거절된 요청은 영구적으로 삭제됩니다.`,
      handleRejectSelected,
      "error"
    );
  }, [selectedRows.length, showConfirm, handleRejectSelected]);

  const handleConfirmSingleApprove = useCallback(
    (id: number) => {
      showConfirm(
        "권한 승인",
        "이 사용자의 권한 요청을 승인하시겠습니까?\n승인된 사용자는 즉시 화이트리스트에 추가됩니다.",
        () => handleAcceptSingle(id),
        "info"
      );
    },
    [showConfirm, handleAcceptSingle]
  );

  const handleConfirmSingleReject = useCallback(
    (id: number) => {
      showConfirm(
        "권한 거절",
        "이 사용자의 권한 요청을 거절하시겠습니까?\n거절된 요청은 영구적으로 삭제됩니다.",
        () => handleRejectSingle(id),
        "error"
      );
    },
    [showConfirm, handleRejectSingle]
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h4 className="text-lg font-semibold mb-4">권한 요청 목록</h4>
      <WhitelistRequestHeader
        onRefresh={loadRequests}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        loading={loading}
        handleConfirmApprove={handleConfirmSelectedApprove}
        handleConfirmReject={handleConfirmSelectedReject}
        isButtonDisabled={isButtonDisabled}
      />

      <WhitelistRequestList
        ref={gridRef}
        data={filtered}
        loading={loading}
        onOpenAcceptModal={handleConfirmSingleApprove}
        onOpenRejectModal={handleConfirmSingleReject}
        onSelectionChanged={onSelectionChanged}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={alertModal.hideAlert}
        type={alertModal.config.type}
        title={alertModal.config.title}
        message={alertModal.config.message}
        confirmText={alertModal.config.confirmText}
        onConfirm={alertModal.config.onConfirm}
        showCancel={alertModal.config.showCancel}
        cancelText={alertModal.config.cancelText}
      />
    </div>
  );
};

export default WhitelistRequestsTab;
