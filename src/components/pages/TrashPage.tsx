import React, { useRef } from "react";
import FilterBadgeButton from "../filter/FilterBadgeButton";
import DataInput from "../searchs/DataInput";
import { Label } from "../ui/label";
import FilterColumnHeader from "../filter/FilterColumnHeader";
import FilterLut from "../filter/FilterLut";
import DataTable from "../tables/DataTable";
import PaginationComponent from "../tables/Pagination";
import { Button } from "../ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { TableColumnSetting } from "../tables/TableColumnSetting";
import type { AgGridReact } from "ag-grid-react";
import { useUserPermissionStore } from "@/stores/useUserPermissionStore";
import { useDataTableStore } from "@/stores/useTableDataStore";
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";
import { useFilterLutSelectionStore } from "@/stores/useSelectionStore";
import { Role } from "@/types/user";
import { deleteStorageData } from "@/handlers/services/StorageDataTable.service.handler";
import { convertSearchMode, createfilterInfo } from "@/handlers/events/filterSearch.service.handler";
import type { SearchInfoBody } from "@/stores/useTableDataStore";
import { deleteTrashData, restoreTrashData } from "@/handlers/services/trashDataTable.service.handler";

type ActionButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};
const RestoreButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled,
  className,
}) => {
  return (
    <Button
      aria-label="Restore selected items"
      variant="default"
      size="default"
      onClick={onClick}
      disabled={disabled}
      className={
        "flex items-center justify-center h-12 w-36 self-start text-sm sm:text-base " +
        "cursor-pointer bg-white rounded-md transition-colors " +
        "border border-gray-300 hover:bg-gray-100/50 hover:border-gray-400 " +
        "focus-visible:ring-0 " +
        (className ?? "")
      }
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Restore
    </Button>
  );
};

const PermanentDeleteButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled,
  className,
}) => {
  return (
    <Button
      aria-label="Delete selected items permanently"
      variant="default"
      size="default"
      onClick={onClick}
      disabled={disabled}
      className={
        "flex items-center justify-center h-12 w-36 self-start text-sm sm:text-base " +
        "cursor-pointer bg-white rounded-md transition-colors " +
        "border border-gray-300 hover:bg-gray-100/50 hover:border-gray-400 " +
        "focus-visible:ring-0 " +
        (className ?? "")
      }
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Delete
    </Button>
  );
};

const TrashPage: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const paginationInfo = useDataTableStore((state) => state.pagination);
  const userPermission = useUserPermissionStore((state) => state.permissionData);
  const filterLutSected = useFilterLutSelectionStore((state) => state.selected);
  const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);
  const fetchTrashData = useDataTableStore((state) => state.fetchTrashData);

  // TODO: 실제 선택 로직에 연결
  const onRestoreSelected = async () => {
    // 선택 항목 복원 로직 연결
    console.log("restore selected");
    const selectedNodes =
      gridRef && "current" in gridRef
        ? gridRef.current?.api?.getSelectedNodes()
        : undefined;

    if (!selectedNodes || selectedNodes.length === 0) {
      window.alert("복구 및 삭제할 행을 선택해주세요.");
      return;
    }
    // 삭제할 항목들을 groupIds와 fileIds로 분류
    const groupIds: number[] = [];
    const fileIds: number[] = [];

    selectedNodes.forEach((node) => {
      const id = node.data?.registrationNumber;
      const isGroup = (node.parent as any)?.__selected === true;
      if (id) {
        if (isGroup) {
          if (groupIds.includes(Number(node.parent?.key))) {
            return;
          }
          groupIds.push(Number(node.parent?.key));
        } else {
          fileIds.push(Number(id));
        }
      }
    });

    const deleteRequestBody = {
      groupIds,
      fileIds
    };

    console.log("복구 요청 바디:", deleteRequestBody);

    try {
      // 실제 복구 API 호출
      const result = await restoreTrashData(deleteRequestBody);

      if (result.success) {
        window.alert("파일이 성공적으로 복구되었습니다.");
      } else {
        window.alert("복구 중 오류가 발생했습니다.");
      }

      // 삭제 후 데이터 새로고침
      const mode = convertSearchMode(searchKeyword);
      const searchInfo = createfilterInfo(
        filterLutSected,
        paginationInfo,
        searchKeyword,
        mode
      );

      fetchTrashData(searchInfo as SearchInfoBody);

    } catch (error) {
      console.error("복구 실패:", error);
      window.alert("복구 중 오류가 발생했습니다.");
    }
  };

  const onDeleteSelected = async () => {
    // 선택 항목 영구 삭제 로직 연결
    console.log("delete selected");
    const selectedNodes =
      gridRef && "current" in gridRef
        ? gridRef.current?.api?.getSelectedNodes()
        : undefined;

    if (!selectedNodes || selectedNodes.length === 0) {
      window.alert("삭제할 행을 선택해주세요.");
      return;
    }

    const hasDeletePermission = selectedNodes.every((node) => {
      const uploadedBy = node.data?.uploadedBy || node.data?.uploaded_by;
      const currentUserId = userPermission.id;
      // TODO TEST 용 하드코딩
      const currentUserRole = "SUPER_ADMIN";
      
      return (
        currentUserRole === Role.SUPER_ADMIN || 
        currentUserRole === Role.ADMIN ||
        (currentUserId && uploadedBy && currentUserId === uploadedBy)
      );
    });

    if (!hasDeletePermission) {
      window.alert("삭제 권한이 없습니다. super_admin 이상의 권한이거나 등록자 본인만 삭제할 수 있습니다.");
      return;
    }

    // 삭제할 항목들을 groupIds와 fileIds로 분류
    const groupIds: number[] = [];
    const fileIds: number[] = [];

    selectedNodes.forEach((node) => {
      const id = node.data?.registrationNumber;
      const isGroup = (node.parent as any)?.__selected === true; 
      if (id) {
        if (isGroup) {
          if(groupIds.includes(Number(node.parent?.key))) {
            return;
          }
          groupIds.push(Number(node.parent?.key));
        } else {
          fileIds.push(Number(id));
        }
      }
    });

    const deleteRequestBody = {
      groupIds,
      fileIds
    };

    console.log("삭제 요청 바디:", deleteRequestBody);

    try {
      // 실제 삭제 API 호출
      const result = await deleteTrashData(deleteRequestBody);

      if (result.success) {
        window.alert("파일이 성공적으로 삭제되었습니다.");
      } else {
        window.alert("삭제 중 오류가 발생했습니다.");
      }
      
      // 삭제 후 데이터 새로고침
      const mode = convertSearchMode(searchKeyword);
      const searchInfo = createfilterInfo(
        filterLutSected,
        paginationInfo,
        searchKeyword,
        mode
      );
      
      fetchTrashData(searchInfo as SearchInfoBody);

    } catch (error) {
      console.error("삭제 실패:", error);
      window.alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <main className="min-h-screen p-8">
        <header className="mb-4">
          <h2 className="text-2xl font-bold">휴지통</h2>
          <p className="text-gray-600">
            삭제된 파일들을 관리하는 페이지입니다.
          </p>
        </header>

        {/* 필터 / 검색 */}
        <section className="w-full mb-20">
          <div className="flex flex-col items-start w-full">
            <FilterBadgeButton pageType="trash" />
            <DataInput pageType="trash" />
            <div className="flex flex-row gap-x-2 w-full justify-center mt-2 pr-16">
              <Label className="text-xl font-medium text-gray-600">필터</Label>
              <div className="h-10 w-px bg-gray-300 mx-3" />
              <FilterColumnHeader />
              <FilterLut pageType="trash" />
            </div>
          </div>
        </section>

        {/* 툴바 */}
        <div className="flex justify-between items-center w-full mb-4 pr-2">
          <div className="flex gap-3">
            <RestoreButton
              onClick={onRestoreSelected}
            // 선택 안되어있으면 비활성화
            // disabled={!hasSelection}
            />
            <PermanentDeleteButton
              onClick={onDeleteSelected}
            // 선택 안되어있으면 비활성화
            // disabled={!hasSelection}
            />
          </div>
          <TableColumnSetting />
        </div>

        {/* 테이블 */}
        <section className="flex flex-col w-full h-[700px]">
          <div className="flex-1 min-h-0">
            <DataTable ref={gridRef} />
          </div>
          <div className="mt-2 mb-10">
            <PaginationComponent />
          </div>
        </section>
      </main>
    </>
  );
};

export default TrashPage;
