import { useCallback, useRef, useState } from "react"
import type {
  ColDef,
  IRowNode,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community"
import { Download, type LucideIcon } from "lucide-react"
import { RowDropDownMenu } from "@/components/DropDownMenu"

export type Payment = {
  id: string
  download: LucideIcon
  fileName: string
  filePath: string
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

const tableData: Payment[] = [
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
]

// ✅ 파일 다운로드 핸들러
const handleDownload = (fileName: string) => {
  const blob = new Blob(['테스트 파일 내용'], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// ✅ ag-grid 컬럼 정의
export const columnDefs: ColDef<Payment>[] = [
  {
    colId: 'checkbox',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50,
    pinned: 'left',
    resizable: false,
  },
  {
    headerName: 'Download',
    cellRenderer: (params: any) => {
      const Icon = params.data.download;
      return (
        <div className="flex items-center justify-center p-1">
          <button
            onClick={() => handleDownload(params.data.fileName)}
            className="hover:bg-gray-100 p-1 rounded transition-colors"
            title={`Download ${params.data.fileName}`}
          >
            <Icon className="w-4 h-4 text-gray-500 hover:text-blue-600 transition-colors" />
          </button>
        </div>
      );
    },
    width: 100,
  },
  { headerName: 'File Name', field: 'fileName', width: 150, cellStyle: { textAlign: 'center' } },
  { headerName: 'File Path', field: 'filePath', width: 200, cellStyle: { textAlign: 'center' } },
  { headerName: 'File Size', field: 'fileSize', width: 100, cellStyle: { textAlign: 'center' } },
  { headerName: 'File Type', field: 'fileType', width: 120, cellStyle: { textAlign: 'center' } },
  { headerName: 'Test Type', field: 'testType', width: 120, cellStyle: { textAlign: 'center' } },
  { headerName: 'Vehicle', field: 'vehicle', width: 100, cellStyle: { textAlign: 'center' } },
  { headerName: 'Step', field: 'step', width: 100, cellStyle: { textAlign: 'center' } },
  { headerName: 'ECU', field: 'ecu', width: 100, cellStyle: { textAlign: 'center' } },
  { headerName: 'SW Version', field: 'swVersion', width: 120, cellStyle: { textAlign: 'center' } },
  { headerName: 'Test Name', field: 'testName', width: 150, cellStyle: { textAlign: 'center' } },
  { headerName: 'Description', field: 'description', width: 200, cellStyle: { textAlign: 'center' } },
  { headerName: 'Memory Type', field: 'memoryType', width: 120, cellStyle: { textAlign: 'center' } },
  { headerName: 'User', field: 'user', width: 100, cellStyle: { textAlign: 'center' } },
  {
    headerName: 'Created At',
    field: 'createdAt',
    width: 120,
    valueFormatter: (params) => params.value.toLocaleDateString(),
    cellStyle: { textAlign: 'center' }
  },
  { headerName: 'Status', field: 'status', width: 100, cellStyle: { textAlign: 'center' } },
  { headerName: 'Email', field: 'email', width: 150, cellStyle: { textAlign: 'center' } },
  {
    headerName: 'Actions',
    cellRenderer: (params: any) => (
      <div className="flex justify-center items-center">
        <RowDropDownMenu payment={params.data} />
      </div>
    ),
    width: 100,
  }
];


// ✅ useAgGrid 훅
export const useAgGrid = () => {
  const selectedMapRef = useRef(new Map<string, boolean>());
  const [data, setData] = useState<Payment[]>(tableData);
  
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const newMap = new Map<string, boolean>();
    event.api.forEachNode((node) => {
      newMap.set(node.id!, node.isSelected() || false);
    });
    selectedMapRef.current = newMap;
  };

  const onRowClicked = (event: RowClickedEvent) => {
    const api = event.api;
    const clickedNode = event.node;
    const selectedNodes = api.getSelectedNodes();
    const isShift = (event.event as KeyboardEvent)?.shiftKey;
    const isCtrl = (event.event as KeyboardEvent)?.ctrlKey || (event.event as KeyboardEvent)?.metaKey;
    const selectedMap = selectedMapRef.current;
    const isSelected = selectedMap.get(clickedNode.id!);

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

  return {
    data,
    columnDefs,
    onRowClicked,
    onSelectionChanged
  };
};
