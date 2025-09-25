import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import { useColumnsStore } from "@/stores/useColumnsStore";
import type {
  SearchInfoBody,
  PaginationInfo,
} from "@/stores/useTableDataStore";
import { useDataTableStore } from "@/stores/useTableDataStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ColDef,
} from "ag-grid-enterprise";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";
import "ag-grid-enterprise/styles/ag-theme-material.css";
import {
  AllEnterpriseModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-enterprise";
import { useMemo } from "react";
import {
  useFilterLutSelectionStore,
  useFilterColumnHeaderSelectionStore
} from "@/stores/useSelectionStore";
import {
  convertSearchMode,
  createfilterInfo,
} from "@/handlers/events/filterSearch.service.handler";
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";
import { forwardRef } from "react";
import { useAdvancedSearchStore } from "@/stores/useAdvancedSearchStore";
import EditButton from "../edits/EditButton";
import {
  useEditModalStore,
  useFileToggleStore,
  useFileUploadStore,
} from "@/stores/useFileInputStore";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useLocation } from "react-router-dom";
import { ROUTE_PATH } from "@/config/path.config";
import { useUserPermissionStore } from "@/stores/useUserPermissionStore";
import { Role } from "@/types/user";
import { deleteStorageData } from "@/handlers/services/StorageDataTable.service.handler";

ModuleRegistry.registerModules([
  AllEnterpriseModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

interface DataTableProps {
  selectionChanged?: () => void;
}

const DataTable = forwardRef<AgGridReact<any>, DataTableProps>((props, ref) => {
  const { selectionChanged } = props;
  const location = useLocation();
  const columns = useColumnsStore((state) => state.columns);
  const selectedColumns = useColumnsStore((state) => state.selectedColumns);
  const fetchColumns = useColumnsStore((state) => state.fetchStorageColumns);
  const fetchLutRules = useColumnsStore((state) => state.fetchStorageLutRules);

  const data = useDataTableStore((state) => state.data);
  const fetchSearchData = useDataTableStore((state) => state.fetchSearchData);
  const fetchTrashData = useDataTableStore((state) => state.fetchTrashData);
  const setIsFolderMode = useFileToggleStore((state) => state.setIsFolderMode);

  // const gridRef = React.useRef<AgGridReact<any>>(null);
  const prevPaginationInfo = React.useRef<PaginationInfo>();
  const paginationInfo = useDataTableStore((state) => state.pagination);
  const setPaginationInfo = useDataTableStore((state) => state.setPagination);

  const filterLutSected = useFilterLutSelectionStore((state) => state.selected);
  const clearFilterLut = useFilterLutSelectionStore((state) => state.clearAll);
  const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);
  const setSearchKeyword = useSearchKeywordStore((state) => state.setSearchKeyword);
  const searchType = useAdvancedSearchStore((state) => state.searchType);
  const clearAdvancedSearch = useAdvancedSearchStore((state) => state.clearAllAdvancedSearch);
  const setSearchType = useAdvancedSearchStore((state) => state.setSearchType);
  const clearFilterColumnHeader = useFilterColumnHeaderSelectionStore((state) => state.clearAll);

  const userPermission = useUserPermissionStore((state) => state.permissionData);

  // const [showEditModal, setShowEditModal] = useState(false);
  const showEditModal = useEditModalStore((state) => state.showEditModal);
  const setShowEditModal = useEditModalStore((state) => state.setShowEditModal);
  const setFileMetadata = useFileMetaDataStore(
    (state) => state.setFileMetadata
  );
  const setSelectedFiles = useFileUploadStore(
    (state) => state.setSelectedFiles
  );

  // 페이지 사이즈 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  const handlePaginationChanged = async () => {
    const pageSize = paginationInfo.pageSize;
    const currentPage = paginationInfo.currentPage;

    if (prevPaginationInfo.current) {
      const prev = prevPaginationInfo.current;

      if (prev.pageSize !== pageSize || prev.currentPage !== currentPage) {
        const mode = convertSearchMode(searchKeyword);
        const searchInfo = createfilterInfo(
          filterLutSected,
          paginationInfo,
          searchKeyword,
          mode
        );

        if (location.pathname === ROUTE_PATH.TRASH) {
          fetchTrashData(searchInfo as SearchInfoBody);
        } else if (location.pathname === ROUTE_PATH.STORAGE) {
          fetchSearchData(searchInfo as SearchInfoBody);
        }
      }
    }
    prevPaginationInfo.current = paginationInfo;
  };

  const onGridReady = () => {
    // fetchPageData(paginationInfo);
    const mode = convertSearchMode(searchKeyword);
    const searchInfo = createfilterInfo(
      filterLutSected,
      paginationInfo,
      searchKeyword,
      mode
    );
    if (location.pathname === ROUTE_PATH.TRASH) {
      fetchTrashData(searchInfo as SearchInfoBody);
    } else if (location.pathname === ROUTE_PATH.STORAGE) {
      fetchSearchData(searchInfo as SearchInfoBody);
    }
    fetchColumns();
    fetchLutRules();
  };

  React.useEffect(() => {
    if (ref && "current" in ref && ref.current?.api) {
      const timer = setTimeout(() => {
        moveAutoCol(1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data, selectedColumns, paginationInfo, filterLutSected, showEditModal]);

  React.useEffect(() => {
    if (ref && "current" in ref && ref.current?.api && data.length > 0) {
      const shouldExpand = searchType !== "GROUP";
      ref.current.api.forEachNode((node) => {
        if (node.group) {
          node.setExpanded(shouldExpand);
        }
      });
    }
  }, [searchType, data]);

  // 페이지 변경 시 필터 초기화 및 fetch 다시 보내기
  React.useEffect(() => {
    const isStorageOrTrashPage =
      location.pathname === ROUTE_PATH.STORAGE ||
      location.pathname === ROUTE_PATH.TRASH;

    if (isStorageOrTrashPage) {
      // 필터 정보 초기화
      setSearchKeyword("");
      clearAdvancedSearch();
      setSearchType("ALL");
      clearFilterLut();
      clearFilterColumnHeader();

      // 페이지네이션 초기화
      setPaginationInfo({
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
        totalRow: 0,
      });

      // fetch 다시 보내기
      if (ref && "current" in ref && ref.current?.api) {
        const mode = convertSearchMode("");
        const searchInfo = createfilterInfo(
          new Map(),
          { pageSize: 10, currentPage: 1, totalPages: 0, totalRow: 0 },
          "",
          mode
        );
        if (location.pathname === ROUTE_PATH.TRASH) {
          fetchTrashData(searchInfo as SearchInfoBody);
        } else if (location.pathname === ROUTE_PATH.STORAGE) {
          fetchSearchData(searchInfo as SearchInfoBody);
        }
      }
    }
  }, [location.pathname]);

  const handlePageSizeChange = async (newPageSize: string) => {
    const size = parseInt(newPageSize);
    const currentPage = 1;
    setPaginationInfo({
      ...paginationInfo,
      pageSize: size,
      currentPage: currentPage,
    });
  };

  const handleDelete = async () => {
    const selectedNodes =
      ref && "current" in ref
        ? ref.current?.api?.getSelectedNodes()
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
      const result = await deleteStorageData(deleteRequestBody);

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
      
      fetchSearchData(searchInfo as SearchInfoBody);

    } catch (error) {
      console.error("삭제 실패:", error);
      window.alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    const selectedNodes =
      ref && "current" in ref
        ? ref.current?.api?.getSelectedNodes()
        : undefined;

    if (!selectedNodes || selectedNodes.length === 0) {
      window.alert("편집할 행을 선택해주세요.");
      return;
    }

    const pathLengths = selectedNodes.map((node) =>
      Array.isArray(node.data?.path) ? node.data.path.length : 0
    );
    const firstLength = pathLengths[0];
    const hasDifferentLength = pathLengths.some(
      (length) => length !== firstLength
    );

    if (hasDifferentLength) {
      window.alert("폴더나 파일 둘 중 하나만 선택해주세요.");
      return;
    }

    if (firstLength > 1) {
      setIsFolderMode(true);
    } else {
      setIsFolderMode(false);
    }

    // 선택된 행의 데이터를 fileMetadata에 설정 (부모 데이터 포함)
    selectedNodes.forEach((node, index) => {
      const nodeData = {
        ...node.data,
        parentData: node.parent ? node.parent.data : null,
      };
      setFileMetadata(index, nodeData);
    });

    // 선택된 행의 파일 정보를 setSelectedFiles로 설정
    if (selectedNodes && selectedNodes.length > 0) {
      const files = selectedNodes.map((node) => node.data as File);
      setSelectedFiles(files);
    }

    setShowEditModal(true);
  };

  // 컬럼 이동을 막으려면 suppressMovable: true 옵션을 추가하면 됩니다.
  // 내부 content 가운데 정렬을 위해 cellStyle 추가
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "등록번호",
      field: "registrationNumber",
      cellRendererParams: {
        suppressCount: true,
      },
      width: 200,
      suppressMovable: true, // 컬럼 이동 비활성화
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }, // 가운데 정렬
    };
  }, []);

  // 체크박스 전용 컬럼
  const checkboxCol: ColDef = {
    colId: "select",
    headerName: "",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    width: 48,
    pinned: "left",
    lockPinned: true,
    resizable: false,
    sortable: false,
    suppressMovable: true,
  };

  const moveAutoCol = (orderIndex: number) => {
    const AUTO_COL_ID = "ag-Grid-AutoColumn";
    if (ref && "current" in ref) {
      ref.current?.api?.moveColumns([AUTO_COL_ID], orderIndex);
    }
  };

  const getDataPath = React.useCallback((data: any) => data.path, []);

  const filteredColumns = useMemo(() => {
    const filteredColumns = columns.filter((column) =>
      selectedColumns.includes(column.field || "")
    );

    // 등록번호 컬럼을 찾아서 두 번째 위치로 고정
    const registrationColumn = filteredColumns.find(
      (col) => col.field === "registrationNumber"
    );
    const otherColumns = filteredColumns.filter(
      (col) => col.field !== "registrationNumber"
    );

    if (registrationColumn) {
      // 체크박스, 등록번호, 나머지 컬럼 순서로 고정
      return [checkboxCol, registrationColumn, ...otherColumns];
    }

    return [checkboxCol, ...filteredColumns];
  }, [columns, selectedColumns]);

  const isStoragePage = location.pathname === ROUTE_PATH.STORAGE;

  // AgGridReact 컴포넌트 렌더링 함수
  const renderAgGrid = () => (
    <AgGridReact
      ref={ref}
      enableBrowserTooltips={true}
      rowData={data}
      columnDefs={filteredColumns}
      rowHeight={70}
      pagination={false}
      paginationPageSize={paginationInfo.pageSize}
      suppressPaginationPanel={true}
      animateRows={true}
      domLayout="normal"
      rowSelection="multiple"
      autoGroupColumnDef={autoGroupColumnDef}
      treeData={true}
      groupDefaultExpanded={searchType === "GROUP" ? -1 : 1}
      suppressContextMenu={true}
      suppressRowClickSelection={false}
      groupSelectsChildren={true}
      groupSelectsFiltered={true}
      getDataPath={getDataPath}
      headerHeight={60}
      rowMultiSelectWithClick={true}
      defaultColDef={{
        sortable: true,
        resizable: true,
        width: 200,
        suppressSizeToFit: true,
        cellStyle: {
          display: "block",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: "70px",
          height: "100%",
        },
      }}
      onSelectionChanged={() => {
        if (selectionChanged) {
          selectionChanged();
        }
      }}
      onGridReady={onGridReady}
      onPaginationChanged={handlePaginationChanged}
      onGridSizeChanged={() => {
        if (ref && "current" in ref && ref.current) {
          ref.current.api.sizeColumnsToFit();
        }
      }}
    />
  );

  return (
    <div className="w-full h-full">
      {isStoragePage ? (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="ag-theme-material w-full h-[calc(100vh-550px)]">
              {renderAgGrid()}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-[250px] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
            <ContextMenuItem className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 cursor-pointer">
              <span>다운로드</span>
            </ContextMenuItem>
            <ContextMenuItem
              className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 cursor-pointer"
              onClick={handleEdit}
            >
              <span>편집</span>
            </ContextMenuItem>
            <ContextMenuSeparator className="h-1 bg-gray-200 opacity-100" />
            <ContextMenuItem
              className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 text-red-600 cursor-pointer"
              onClick={handleDelete}
            >
              <span>삭제</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        <div className="ag-theme-material w-full h-[calc(100vh-550px)]">
          {renderAgGrid()}
        </div>
      )}
      {/* 커스텀 페이지 사이즈 선택기 */}
      <div className="flex items-center justify-end gap-2 mt-2 pr-2">
        <span className="text-sm text-gray-400">페이지당 행 수:</span>
        <Select
          value={paginationInfo.pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-20 cursor-pointer border border-gray-300 justify-center">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 flex flex-col items-center justify-center">
            {pageSizeOptions.map((size: number) => (
              <SelectItem
                key={size}
                value={size.toString()}
                className="cursor-pointer bg-white text-center focus:bg-blue-100"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* 편집 모달 */}
      <EditButton />
    </div>
  );
});

export default React.memo(DataTable);
