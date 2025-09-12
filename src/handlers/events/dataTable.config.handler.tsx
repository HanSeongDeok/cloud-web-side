import type {
  ColDef,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community"
import { RowDropDownMenu } from "@/components/tables/TableColumnSetting"
import { useSelectionStore } from "@/stores/useSelectionStore"
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";
import { debounce, throttle } from "lodash";  

export type Column = {
  [key: string]: string
}

// 여기서 context menu(컨텍스트 메뉴) 추가 가능합니다.
// ag-Grid의 ColDef에는 getContextMenuItems 프로퍼티를 사용할 수 있습니다.
// 아래는 예시로, 각 컬럼에 우클릭 시 간단한 컨텍스트 메뉴를 추가한 코드입니다.

export const createCustomColumn = (id: string, displayName: string): ColDef<Column> => {
  return {
    headerName: displayName,
    field: id,
    tooltipValueGetter: (params) => params.value,
  }
}

export const columnDefs_DEV = (id: string, displayName: string): ColDef<Column>[] => {
  return [
    createCustomColumn(id, displayName),
  ]
}

// 선택 변경 이벤트 핸들러
export const onSelectionChanged = (event: SelectionChangedEvent) => {
  const newMap = new Map<string, boolean>();
  event.api.forEachNode((node) => {
    newMap.set(node.id!, node.isSelected() || false);
  });
  useSelectionStore.getState().setSelectedMap(newMap);
};

// 행 클릭 이벤트 핸들러
export const onRowClicked = (event: RowClickedEvent) => {
  const target = event.event?.target as HTMLElement;
  const api = event.api;
  const clickedNode = event.node;
  const selectedNodes = api.getSelectedNodes();
  const isShift = (event.event as KeyboardEvent)?.shiftKey;
  const isCtrl = (event.event as KeyboardEvent)?.ctrlKey || (event.event as KeyboardEvent)?.metaKey;
  const isSelected = useSelectionStore.getState().isSelected(clickedNode.id!);

  if (
    target.closest('button') ||              
    target.closest('svg') ||                 
    target.closest('.no-select-cell')        
  ) {
    clickedNode.setSelected(true);
    return;
  }

  if (selectedNodes.length > 0 && !isCtrl) {
    if (selectedNodes.includes(clickedNode) && selectedNodes.length === 1) {
      clickedNode.setSelected(false);
    }
    else if (!isShift) {
      api.deselectAll();
      clickedNode.setSelected(true);
    }
  } else {
    clickedNode.setSelected(!isSelected);
  }
}

/**
 * Data Input Search Handler
 */
export const handleChangeDebounce = debounce((value: string) => {
  useSearchKeywordStore.getState().setSearchKeyword(value);
  console.log(value)
}, 200);

export const handleChangeThrottle = throttle((value: string) => {
  useSearchKeywordStore.getState().setSearchKeyword(value);
  console.log(value)
}, 200);

//TODO 실제 검색 버튼 클릭 시점 Backend 통신 핸들러 정의
export const onSearchClickThrottle = () => {
  handleChangeThrottle.flush();
}


//==============================================

/**
 * AG-GRID EXAMPLE
 */

export type Payment = {
  id: string
  fileName: string
  fileSize: string
  fileType: string
  testType: string
  vehicle: string
  step: string
  ecu: string
  swVersion: string
  testName: string
  description: string
  memoryType: string
  user: string
  createdAt: Date
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

/**
 * 체크박스 컬럼 생성
 * @returns 체크박스 컬럼
 */
const createCheckbox_temp = (): ColDef<Payment> => {
  return {
    colId: 'checkbox',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50,
    pinned: 'left',
    resizable: false,
  }
}
   
/**
 * 파일명 컬럼 생성
 * @returns 파일명 컬럼
 */
const createFileNameColumn_temp = (): ColDef<Payment> => {
  return {
    headerName: 'File Name', 
    field: 'fileName', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 파일크기 컬럼 생성
 * @returns 파일크기 컬럼
 */
const createFileSizeColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'File Size', 
    field: 'fileSize', 
    width: 100, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 파일타입 컬럼 생성
 * @returns 파일타입 컬럼
 */
const createFileTypeColumn_temp = (): ColDef<Payment> => {

  return { 
    headerName: 'File Type', 
    field: 'fileType', 
    width: 120, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 테스트타입 컬럼 생성
 * @returns 테스트타입 컬럼
 */
const createTestTypeColumn_temp = (): ColDef<Payment> => {   
  return { 
    headerName: 'Test Type', 
    field: 'testType', 
    width: 120, 
    cellStyle: { textAlign: 'center' } 
  }
}     

/**
 * 차량 컬럼 생성
 * @returns 차량 컬럼
 */
const createVehicleColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Vehicle', 
    field: 'vehicle', 
    width: 100, 
    cellStyle: { textAlign: 'center' } 
  }
} 

/**
 * 스텝 컬럼 생성
 * @returns 스텝 컬럼
 */
const createStepColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Step', 
    field: 'step', 
    width: 100, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * ECU 컬럼 생성
 * @returns ECU 컬럼
 */
const createEcuColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'ECU', 
    field: 'ecu', 
    width: 100, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * SW버전 컬럼 생성
 * @returns SW버전 컬럼
 */
  const createSwVersionColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'SW Version', 
    field: 'swVersion', 
    width: 120, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 테스트명 컬럼 생성
 * @returns 테스트명 컬럼
 */
const createTestNameColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Test Name', 
    field: 'testName', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 설명 컬럼 생성
 * @returns 설명 컬럼
 */
const createDescriptionColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Description', 
    field: 'description', 
    width: 200, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 메모리타입 컬럼 생성
 * @returns 메모리타입 컬럼
 */
const createMemoryTypeColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Memory Type', 
    field: 'memoryType', 
    width: 120, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 사용자 컬럼 생성
 * @returns 사용자 컬럼
 */
const createUserColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'User', 
    field: 'user', 
    width: 100, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 생성일 컬럼 생성
 * @returns 생성일 컬럼
 */
const createCreatedAtColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Created At', 
    field: 'createdAt', 
    width: 120, 
    valueFormatter: (params) => params.value.toLocaleDateString(), 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 상태 컬럼 생성
 * @returns 상태 컬럼
 */
const createStatusColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Status', 
    field: 'status', 
    width: 100, 
    cellStyle: { textAlign: 'center' } 
  }
}

/**
 * 이메일 컬럼 생성
 * @returns 이메일 컬럼
 */
const createEmailColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Email', 
    field: 'email', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}  

/**
 * 액션 컬럼 생성
 * @returns 액션 컬럼
 */
  const createActionsColumn_temp = (): ColDef<Payment> => {
  return { 
    headerName: 'Actions', 
    cellRenderer: (params: any) => (
      <RowDropDownMenu payment={params.data} />
    ),
    width: 100,
  }
}

// ag-grid 컬럼 정의
export const columnDefs_temp: ColDef<Payment>[] = [
  createCheckbox_temp(),
  createFileNameColumn_temp(),
  createFileSizeColumn_temp(),
  createFileTypeColumn_temp(),
  createTestTypeColumn_temp(),
  createVehicleColumn_temp(),
  createStepColumn_temp(),
  createEcuColumn_temp(),
  createSwVersionColumn_temp(),
  createTestNameColumn_temp(),
  createDescriptionColumn_temp(),
  createMemoryTypeColumn_temp(),
  createUserColumn_temp(),
  createCreatedAtColumn_temp(),
  createStatusColumn_temp(),
  createEmailColumn_temp(),
  createActionsColumn_temp(),
];