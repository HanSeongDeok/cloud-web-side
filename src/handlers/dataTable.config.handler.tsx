import type {
  ColDef,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community"
import { RowDropDownMenu } from "@/components/DropDownMenu"
import { useSelectionStore } from "@/stores/useSelectionStore"
import { useColumnsStore } from "@/stores/useColumnsStore"

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

export type Column = {
  fileName: string
  testItem: string
  driveType: string
  tcNum: string
  memType: string
  filePath: string
  testType: string
  description: string
  fileModifiedDate: string
  fileCreator: string
  devStep: string
  vehicle: string
  createdAt: string
  swVer: string
  depArr: string
  fileSize: string
  ecu: string
  tableNumber: string
  deliverableType: string
  testResult: string
  fileCreatedAt: string
  fileFormat: string
}

/**
 * 파일명 컬럼 생성
 * @returns 파일명 컬럼
 */
const createFileNameColumn = (fileName: string): ColDef<Column> => {
  return {
    headerName: fileName, 
    field: 'fileName', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createTestItemColumn = (testItem: string): ColDef<Column> => {
  return {
    headerName: testItem, 
    field: 'testItem', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createDriveTypeColumn = (driveType: string): ColDef<Column> => {

  return {
    headerName: driveType, 
    field: 'driveType', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createTcNumColumn = (tcNum: string): ColDef<Column> => {

  return {
    headerName: tcNum, 
    field: 'tcNum', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createMemTypeColumn = (memType: string): ColDef<Column> => {

  return {
    headerName: memType, 
    field: 'memType', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createFilePathColumn = (filePath: string): ColDef<Column> => {

  return {
    headerName: filePath, 
    field: 'filePath', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createTestTypeColumn = (testType: string): ColDef<Column> => { 

  return {
    headerName: testType, 
    field: 'testType', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createDescriptionColumn = (description: string): ColDef<Column> => {
  return {
    headerName: description, 
    field: 'description', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createFileModifiedDateColumn = (fileModifiedDate: string): ColDef<Column> => { 
  return {
    headerName: fileModifiedDate, 
    field: 'fileModifiedDate', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createDevStepColumn = (devStep: string): ColDef<Column> => { 
  return {
    headerName: devStep, 
    field: 'devStep', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createVehicleColumn = (vehicle: string): ColDef<Column> => { 
  return {
    headerName: vehicle, 
    field: 'vehicle', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createCreatedAtColumn = (createdAt: string): ColDef<Column> => { 
  return {
    headerName: createdAt, 
    field: 'createdAt', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createSwVerColumn = (swVer: string): ColDef<Column> => { 
  return {
    headerName: swVer, 
    field: 'swVer', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createDepArrColumn = (depArr: string): ColDef<Column> => { 
  return {
    headerName: depArr, 
    field: 'depArr', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createFileSizeColumn = (fileSize: string): ColDef<Column> => { 
  return {
    headerName: fileSize, 
    field: 'fileSize', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createEcuColumn = (ecu: string): ColDef<Column> => { 
  return {
    headerName: ecu, 
    field: 'ecu', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createTableNumberColumn = (tableNumber: string): ColDef<Column> => { 
  return {
    headerName: tableNumber, 
    field: 'tableNumber', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createDeliverableTypeColumn = (deliverableType: string): ColDef<Column> => { 
  return {
    headerName: deliverableType, 
    field: 'deliverableType', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createTestResultColumn = (testResult: string): ColDef<Column> => { 
  return {
    headerName: testResult, 
    field: 'testResult', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createFileCreatedAtColumn = (fileCreatedAt: string): ColDef<Column> => { 
  return {
    headerName: fileCreatedAt, 
    field: 'fileCreatedAt', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createFileFormatColumn = (fileFormat: string): ColDef<Column> => { 
  return {
    headerName: fileFormat, 
    field: 'fileFormat', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

const createFileCreatorColumn = (fileCreator: string): ColDef<Column> => { 
  return {
    headerName: fileCreator, 
    field: 'fileCreator', 
    width: 150, 
    cellStyle: { textAlign: 'center' } 
  }
}

export const columnDefs = (columns: Column): ColDef<Column>[] => {
  return [
    createFileNameColumn(columns.fileName),
    createTestItemColumn(columns.testItem),
    createDriveTypeColumn(columns.driveType),
    createTcNumColumn(columns.tcNum),
    createMemTypeColumn(columns.memType),
    createFilePathColumn(columns.filePath),
    createTestTypeColumn(columns.testType),
    createDescriptionColumn(columns.description),
    createFileModifiedDateColumn(columns.fileModifiedDate),
    createFileCreatorColumn(columns.fileCreator),
    createDevStepColumn(columns.devStep),
    createVehicleColumn(columns.vehicle),
    createCreatedAtColumn(columns.createdAt),
    createSwVerColumn(columns.swVer),
    createDepArrColumn(columns.depArr),
    createFileSizeColumn(columns.fileSize),
    createEcuColumn(columns.ecu),
    createTableNumberColumn(columns.tableNumber),
    createDeliverableTypeColumn(columns.deliverableType),
    createTestResultColumn(columns.testResult),
    createFileCreatedAtColumn(columns.fileCreatedAt),
    createFileFormatColumn(columns.fileFormat),
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
