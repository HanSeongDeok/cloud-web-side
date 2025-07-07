import type {
  ColDef,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community"
import { RowDropDownMenu } from "@/components/DropDownMenu"
import { useSelectionStore } from "@/stores/useSelectionStore"

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
const createCheckbox = (): ColDef<Payment> => {
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
const createFileNameColumn = (): ColDef<Payment> => {
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
const createFileSizeColumn = (): ColDef<Payment> => {
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
const createFileTypeColumn = (): ColDef<Payment> => {

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
const createTestTypeColumn = (): ColDef<Payment> => {   
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
const createVehicleColumn = (): ColDef<Payment> => {
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
const createStepColumn = (): ColDef<Payment> => {
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
const createEcuColumn = (): ColDef<Payment> => {
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
  const createSwVersionColumn = (): ColDef<Payment> => {
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
const createTestNameColumn = (): ColDef<Payment> => {
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
const createDescriptionColumn = (): ColDef<Payment> => {
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
const createMemoryTypeColumn = (): ColDef<Payment> => {
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
const createUserColumn = (): ColDef<Payment> => {
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
const createCreatedAtColumn = (): ColDef<Payment> => {
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
const createStatusColumn = (): ColDef<Payment> => {
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
const createEmailColumn = (): ColDef<Payment> => {
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
  const createActionsColumn = (): ColDef<Payment> => {
  return { 
    headerName: 'Actions', 
    cellRenderer: (params: any) => (
      <RowDropDownMenu payment={params.data} />
    ),
    width: 100,
  }
}

// ag-grid 컬럼 정의
export const columnDefs: ColDef<Payment>[] = [
  createCheckbox(),
  createFileNameColumn(),
  createFileSizeColumn(),
  createFileTypeColumn(),
  createTestTypeColumn(),
  createVehicleColumn(),
  createStepColumn(),
  createEcuColumn(),
  createSwVersionColumn(),
  createTestNameColumn(),
  createDescriptionColumn(),
  createMemoryTypeColumn(),
  createUserColumn(),
  createCreatedAtColumn(),
  createStatusColumn(),
  createEmailColumn(),
  createActionsColumn(),
];

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
