import DataTable from "@/components/tables/DataTable";
import DataInput from "../searchs/DataInput";
import FilterColumnHeader from "../filter/FilterColumnHeader";
import FilterLut from "../filter/FilterLut";
import FilterBadgeButton from "../filter/FilterBadgeButton";
import UploadButton from "../uploads/UploadButton";
import DownloadButton from "../storage/DownloadButton";
import PaginationComponent from "../tables/Pagination";
import { Label } from "../ui/label";
import { memo, useCallback, useRef, useState } from "react";
import StorageFloatButton from "../storage/StorageFloatButton";
import FileProgressCards from "../storage/fileProgressCards";
import type { AgGridReact } from "ag-grid-react";
import type {
  DownloadInfo,
  DownLoadRequest,
  downLoadType,
} from "@/types/download";
import {
  fetchDownload,
  fetchInitDownload,
} from "@/handlers/services/downLoad.service.handler";
import AlertModal from "../ui/AlertModal";
import { useAlert } from "@/hooks/useAlert";
import { TableColumnSetting } from "../tables/TableColumnSetting";

const StoragePage = memo(() => {
  interface RowData {
    [key: string]: any;
  }
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]); // 선택된 행들 상태로 관리
  const alertModal = useAlert();
  const { showWarning } = alertModal;

  const gridRef = useRef<AgGridReact<any>>(null);

  //TODO : getSelectedNodes로 변경 후 parent 정보로 파일/폴더 정보 구분하기
  // key 값이 null이면 파일 , 아니면 폴더 하위 파일인데, 폴더가 선택되었는지 상태 유무는 전체 자식 숫자를 가져와서
  // 숫자 정보를 토대로 일치하면 , 폴더 선택, 아니면 파일 선택으로 구분
  const onSelectionChanged = useCallback(() => {
    const currentSelectedRows = gridRef.current?.api.getSelectedNodes() || [];
    setSelectedRows(currentSelectedRows as unknown as RowData[]);
    console.log("선택된 행들:", currentSelectedRows);
  }, []);

  const handleDownload = async () => {
    const fileRows = selectedRows.filter(
      (row) =>
        row.parent.key === null ||
        (row.parent.key !== null && row.parent.__selected === undefined)
    );
    const folderRows = selectedRows.filter(
      (row) => row.parent.__selected === true
    );
    const fileIds = fileRows.map((row) => row.key);
    const folderIds = Array.from(
      new Set(folderRows.map((row) => row.parent.key))
    );

    console.log("fileIds:", fileIds);
    console.log("folderIds:", folderIds);

    const selectedNames = Array.from(
      new Set([
        ...fileRows.map((row) => row.data.name),
        ...folderRows.map((row) => row.parent.data.name),
      ])
    );

    console.log("selectedNames:", selectedNames);
    if (fileIds.length === 0 && folderIds.length === 0) {
      showWarning("선택 항목 없음", "다운로드 할 속성을 선택해주세요.");
      return;
    }

    //folder 다운로드의 경우는
    const downloadType: downLoadType =
      fileIds.length === 1 && folderIds.length === 0
        ? "UNCOMPRESSED"
        : "COMPRESSED";

    const downloadRequest: DownLoadRequest = {
      type: downloadType,
      fileIds,
      folderIds,
    };

    const info: DownloadInfo = await fetchInitDownload(
      downloadRequest,
      selectedNames
    );
    // 실제 다운로드 처리
    await fetchDownload(info);
  };
  return (
    <main className="min-h-screen p-8 mt-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4">
          저장소
        </h1>
        <p className="text-muted-foreground mb-10">
          welcome to the VTDM storage
        </p>
      </div>

      {/* 필터 검색 영역 */}
      <div className="w-full mb-20">
        <div className="flex flex-col items-start w-full">
          <FilterBadgeButton pageType="storage" />
          <DataInput pageType="storage" />
          <div className="flex flex-row gap-x-2 w-full justify-center mt-2 pr-15">
            {/* <TypeMultiSelect /> */}
            <Label className="text-xl font-medium text-gray-600">필터</Label>
            <div className="h-10 w-0.5 bg-gray-300 mx-3 font-bold"></div>
            <FilterColumnHeader />
            <FilterLut pageType="storage" />
          </div>
        </div>
      </div>

      {/* 테이블 컬럼 / 업로드 영역 */}
      <div className="flex justify-end w-full mb-4 pr-2">
        <div className="flex items-center gap-4">
          <UploadButton />
          <DownloadButton handleDownload={handleDownload} />
        </div>
        <div className="flex gap-4 ml-auto">
          {/* <TableDropDownMenu /> */}
          <TableColumnSetting />
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="flex flex-col w-full h-[700px]">
        <div>
          <DataTable selectionChanged={onSelectionChanged} ref={gridRef} />
        </div>
        <div className="mt-2 mb-10">
          <PaginationComponent />
        </div>
      </div>
      <div>
        <FileProgressCards />
        <StorageFloatButton />
      </div>

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
    </main>
  );
});

export default StoragePage;
