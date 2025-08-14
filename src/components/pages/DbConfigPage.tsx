// src/pages/DbConfigPage.tsx
import React, { useState, useEffect, useRef } from "react";
import type { DbProperty, NewDbProperty } from "@/types/property";
import DbConfigHeader from "@/components/dbconfig/DbConfigHeader";
import type { AgGridReact } from "ag-grid-react";
import {
  getAllDbProperties,
  createDbProperty,
  updateDbProperty,
  deleteDbProperty,
} from "@/handlers/services/DbProperty.service.handler";
import LutEditModal from "@/components/dbconfig/LUTEditModal";
import type { LutItem, NewLutItem } from "@/types/lut";
import {
  createLutItem,
  deleteLutItem,
  getAllLutItem,
  updateLutItem,
  updateSortOrder,
} from "@/handlers/services/DbLUT.service.handler";
import PropertyEditModal from "../dbconfig/PropertyEditModal";
import DbPropertyTable from "../dbconfig/DbPropertyTable";
import AlertModal from "@/components/ui/AlertModal";
import { useAlert } from "@/hooks/useAlert";

const DbConfigPage: React.FC = () => {
  // 알림 모달 훅
  const alertModal = useAlert();

  //lut 관련 상태
  const [lutModalOpen, setLutModalOpen] = useState(false);
  const [editingLUT, setEditingLUT] = useState<LutItem | null>(null); //현재 수정중인 LUT 아이템 정보
  const [lutItems, setLUTItems] = useState<LutItem[]>([]); // 현재 룩업 아이템 리스트
  const [lutPropertyId, setLutPropertyId] = useState<number | null>(null); // 현재 룩업 아이템의 속성 ID
  // TODO: 추가로 현재 선택된 행의 propertyId가 필요할 듯함
  //속성 관련 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<DbProperty | null>(
    null
  ); // 현재 '수정중인' 속성 정보
  const [properties, setProperties] = useState<DbProperty[]>([]); //테이블 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectionKey, setSelectionKey] = useState(0); // 선택 변경을 감지하기 위한 키
  // AG-Grid ref로 직접 접근
  const gridRef = useRef<AgGridReact>(null);

  // 선택된 행들 중 BUILT_IN 타입이 있는지 확인하는 함수
  const isRemoveDisabled = () => {
    const currentSelectedRows = gridRef.current?.api?.getSelectedRows() || [];
    return currentSelectedRows.some(
      (row: DbProperty) => row.property_type === "BUILT_IN"
    );
  };

  // 선택 변경 핸들러 (리렌더링 트리거)
  const onSelectionChanged = () => {
    setSelectionKey((prev) => prev + 1); // 선택이 변경될 때마다 키 증가로 리렌더링 유도
  };

  // 컴포넌트 마운트 시 데이터 로드 + 주기적 새로고침(30초마다)
  useEffect(() => {
    // 초기 로드
    loadProperties();

    // 주기적 새로고침 (로딩 상태 표시)
    const intervalId = setInterval(() => {
      console.log("주기적 데이터 새로고침...");
      loadProperties();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  /**
   * ==========================
   *   속성 관련 핸들러 (Property Handlers)
   * ==========================
   *
   * 이 영역은 데이터베이스 속성(property) 관련 상태 및 동작을 담당합니다.
   * - 데이터 새로고침, 조회, 추가, 수정, 삭제 등 CRUD 로직을 포함합니다.
   * - 각 함수는 서버와의 통신 및 상태 업데이트를 수행합니다.
   * - 주요 함수:
   *   - loadProperties: 서버에서 최신 속성 데이터를 받아와 상태를 갱신합니다. 로딩/에러 상태를 관리합니다.
   *   - handleAddProperty: 속성 추가 모달을 엽니다.
   *   - handleEditProperty: 선택된 속성의 편집 모달을 엽니다.
   *   - handleSaveProperty: 속성 추가/수정 후 서버에 저장하고, 상태를 갱신합니다.
   *   - handleRemoveProperty: 선택된 속성을 삭제하고, 상태를 갱신합니다.
   *
   * ⚠️ 이 주석 아래로 속성 관련 함수들을 배치하여 관리하세요.
   */
  // 🔄 데이터 로드/새로고침 통합 함수 (항상 로딩 상태 표시)
  const loadProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("속성 데이터 로딩/새로고침 시작...");
      const data = await getAllDbProperties();
      setProperties(data);
      console.log("속성 데이터 로딩/새로고침 완료:", data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다";
      setError(errorMessage);
      console.error("속성 데이터 로딩/새로고침 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  //  속성 추가 모달 핸들러
  const handleAddProperty = () => {
    setEditingProperty(null); // 추가 모드: 전달할 property 없음
    setEditModalOpen(true);
  };

  //  속성 편집 모달 핸들러
  const handleEditProperty = (property: DbProperty) => {
    setEditingProperty(property); // 편집 모드: property 정보 전달
    setEditModalOpen(true);
  };

  // 모달 저장 핸들러 (Pessimistic Update 방식)
  const handleSaveProperty = async (savedProperty: NewDbProperty) => {
    try {
      if (editingProperty) {
        // 편집 모드
        await updateDbProperty(editingProperty.id, savedProperty);
        console.log("속성 수정 API 완료");
      } else {
        // 추가 모드
        await createDbProperty(savedProperty);
        console.log("속성 추가 API 완료");
      }

      //  서버에서 최신 데이터 다시 조회 (다중사용자 변경사항 포함)
      await loadProperties();

      setEditModalOpen(false);
      console.log("속성 저장 및 데이터 새로고침 완료");
    } catch (error) {
      console.error("속성 저장 실패:", error);
      alertModal.showError(
        "속성 저장 실패",
        "속성 저장 중 오류가 발생했습니다."
      );
    }
  };

  //  속성 제거 핸들러 (Pessimistic Update 방식)
  const handleRemoveProperty = async () => {
    // AG-Grid에서 직접 선택된 행들 가져오기
    const selectedRows = gridRef.current?.api?.getSelectedRows() || [];

    if (selectedRows.length === 0) {
      alertModal.showWarning("선택 항목 없음", "삭제할 속성을 선택해주세요.");
      return;
    }

    const selectedIds = selectedRows.map((row: DbProperty) => row.id);

    // 확인 모달로 삭제 확인
    alertModal.showConfirm(
      "속성 삭제 확인",
      `선택된 ${selectedIds.length}개의 속성을 삭제하시겠습니까?\n삭제된 속성은 복구할 수 없습니다.`,
      async () => {
        try {
          console.log("속성 삭제 시작:", selectedIds);

          // API 호출로 속성 삭제 요청
          await deleteDbProperty(selectedIds);

          // 서버에서 최신 데이터 다시 조회 (다중사용자 변경사항 포함)
          await loadProperties();

          console.log("속성 삭제 완료:", selectedIds);
          alertModal.showSuccess(
            "삭제 완료",
            `${selectedIds.length}개의 속성이 삭제되었습니다.`
          );
        } catch (error) {
          console.error("속성 삭제 실패:", error);
          alertModal.showError(
            "삭제 실패",
            "속성 삭제 중 오류가 발생했습니다."
          );
        }
      },
      "error"
    );
  };
  /**
   * ==========================
   *   LUT 관련 핸들러 (LUT Handlers)
   * ==========================
   *
   * 이 영역은 룩업테이블(LUT) 관련 상태 및 동작을 담당합니다.
   * - LUT 데이터의 조회, 추가, 수정, 삭제 등 CRUD 로직을 포함합니다.
   * - 각 함수는 서버와의 통신 및 상태 업데이트를 수행합니다.
   * - 주요 함수:
   *   - refreshLUT: 현재 선택된 속성의 LUT 데이터를 새로고침합니다.
   *   - handleOpenLutModal: 특정 속성의 LUT 편집 모달을 엽니다.
   *   - handleAddLutItem: LUT 아이템을 추가합니다.
   *   - handleDeleteLutItem: LUT 아이템을 삭제합니다.
   *   - handleSaveLUT: LUT 전체를 저장합니다(사용하지 않음).
   *   - handleUpdateLUTItem: LUT 아이템을 수정합니다.
   * ⚠️ 이 주석 아래로 LUT 관련 함수들을 배치하여 관리하세요.
   */
  const refreshLUT = async () => {
    try {
      console.log("LUT 데이터 새로고침 시작...");
      if (lutPropertyId !== null) {
        const lutData = await getAllLutItem(lutPropertyId);
        setLUTItems(lutData);
        console.log("LUT 데이터 새로고침 완료:", lutData);
      } else {
        console.warn(
          "lutPropertyId가 null입니다. LUT 데이터를 새로고침할 수 없습니다."
        );
      }
    } catch (err) {
      console.error("LUT 데이터 새로고침 실패:", err);
    }
  };

  const handleOpenLutModal = async (propertyId: number): Promise<boolean> => {
    try {
      const lutData = await getAllLutItem(propertyId);

      //  (동기적으로 연속된 setState 호출은 1번의 렌더링만 발생 : REACT 18+)
      setLutPropertyId(propertyId);
      setLUTItems(lutData);
      setLutModalOpen(true);

      return true;
    } catch (error) {
      console.error("LUT 데이터 로딩 실패:", error);
      alertModal.showError(
        "데이터 로딩 실패",
        "룩업테이블 데이터를 불러오는데 실패했습니다."
      );
      return false;
    }
  };

  // LUT(룩업테이블) 저장 핸들러 - 새로운 아이템 추가용
  const handleAddLutItem = async (newItem: NewLutItem): Promise<void> => {
    try {
      if (lutPropertyId === null) {
        alertModal.showError("오류", "속성 ID가 설정되지 않았습니다.");
        return;
      }

      // LUT 아이템 생성 API 호출
      await createLutItem(lutPropertyId, newItem);
      console.log("LUT 아이템 생성:", newItem);

      // 데이터 새로고침
      await refreshLUT();

      alertModal.showSuccess(
        "저장 완료",
        "룩업테이블 아이템이 성공적으로 저장되었습니다."
      );
    } catch (error) {
      console.error("룩업테이블 아이템 저장 실패:", error);
      alertModal.showError(
        "저장 실패",
        "룩업테이블 아이템 저장 중 오류가 발생했습니다."
      );
    }
  };

  // LUT 아이템 삭제 핸들러
  const handleDeleteLutItem = async (lutItemId: number): Promise<void> => {
    try {
      if (lutPropertyId === null) {
        alertModal.showError("오류", "속성 ID가 설정되지 않았습니다.");
        return;
      }

      await deleteLutItem(lutPropertyId, lutItemId);
      console.log("LUT 아이템 삭제:", { propertyId: lutPropertyId, lutItemId });

      await refreshLUT();

      // 삭제된 아이템이 현재 편집 중이면 편집 모드 해제
      if (editingLUT?.id === lutItemId) {
        setEditingLUT(null);
      }

      alertModal.showSuccess(
        "삭제 완료",
        "룩업테이블 아이템이 성공적으로 삭제되었습니다."
      );
    } catch (error) {
      console.error("룩업테이블 아이템 삭제 실패:", error);
      alertModal.showError(
        "삭제 실패",
        "룩업테이블 아이템 삭제 중 오류가 발생했습니다."
      );
    }
  };

  const handleUpdateLUTItem = async () => {
    try {
      if (editingLUT) {
        if (lutPropertyId === null) {
          alertModal.showError("오류", "속성 ID가 설정되지 않았습니다.");
          return;
        }
        // 기존 LUT 아이템 수정
        await updateLutItem(lutPropertyId, editingLUT);
      } else {
        console.error("편집 중인 LUT 아이템이 없습니다.");
      }
      await refreshLUT();
      alertModal.showSuccess(
        "수정 완료",
        "룩업테이블 아이템이 성공적으로 저장되었습니다."
      );
    } catch (error) {
      console.error("룩업테이블 아이템 저장 실패:", error);
      alertModal.showError(
        "저장 실패",
        "룩업테이블 아이템 저장 중 오류가 발생했습니다."
      );
    }
  };
  // LUT(룩업테이블) 순서 저장 핸들러
  const handleSaveLutOrder = async (updatedItems: LutItem[]): Promise<void> => {
    try {
      if (lutPropertyId === null) {
        alertModal.showError("오류", "속성 ID가 설정되지 않았습니다.");
        return;
      }
      await updateSortOrder(lutPropertyId, updatedItems);
      await refreshLUT();
      alertModal.showSuccess(
        "저장 완료",
        "룩업테이블 순서가 성공적으로 저장되었습니다."
      );
    } catch (error) {
      console.error("룩업테이블 순서 저장 실패:", error);
      alertModal.showError(
        "저장 실패",
        "룩업테이블 순서 저장 중 오류가 발생했습니다."
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <DbConfigHeader
            onAddProperty={handleAddProperty}
            onRemoveProperty={handleRemoveProperty}
            isRemoveDisabled={isRemoveDisabled()}
          />

          {/* 시스템 속성 안내 정보 */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">안내:</span> 시스템
                  속성(BUILT_IN)은 삭제할 수 없습니다. 시스템 속성이 포함된 선택
                  시 삭제 버튼이 비활성화됩니다.
                </p>
              </div>
            </div>
          </div>

          <DbPropertyTable
            ref={gridRef}
            data={properties}
            loading={loading}
            error={error}
            onEditProperty={handleEditProperty}
            onOpenLutModal={handleOpenLutModal}
            onSelectionChanged={onSelectionChanged}
          />
        </div>
      </div>

      <PropertyEditModal
        isOpen={editModalOpen}
        onSave={handleSaveProperty}
        onClose={() => setEditModalOpen(false)}
        property={editingProperty}
      />

      <LutEditModal
        initialItems={lutItems}
        editingItem={editingLUT}
        isOpen={lutModalOpen}
        onClose={() => {
          setLutModalOpen(false);
          setEditingLUT(null);
        }}
        onEditItem={setEditingLUT}
        onCreateItem={handleAddLutItem}
        onDeleteItem={handleDeleteLutItem}
        onUpdateItem={handleUpdateLUTItem}
        onUpdateOrder={handleSaveLutOrder}
        title={properties.find((prop) => prop.id === lutPropertyId)?.name || ""}
      />

      {/* 알림 모달 */}
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

export default DbConfigPage;

// TODO: 현재 built-in 속성은 삭제할 수 없지만( 버튼 비활성화 처리 ), 개발자 도구 등의 접근으로
// 직접 데이터를 조작해서 API를 호출할 경우를 대비해서 백엔드에서 검증 후
// 예외 상황을 반환하면 대응하는 예외에 따라 안내 모달을 제공할 예정
