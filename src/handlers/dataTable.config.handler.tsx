import { useCallback, useRef, useState } from "react"
import type {
  ColDef,
  IRowNode,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community"
import { Download, type LucideIcon } from "lucide-react"
import { RowDropDownMenu } from "@/components/DropDownMenu"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

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
]

// ✅ Sonner를 활용한 파일 다운로드 핸들러
const handleDownload = async (fileName: string, filePath: string, fileSize: string) => {
  let isCancelled = false;
  let downloadInterval: number | null = null;

  const toastId = toast.loading(
    <div className="relative w-[280px] text-center">
      <Button
        onClick={() => {
          isCancelled = true;
          if (downloadInterval) {
            clearInterval(downloadInterval);
          }
          toast.dismiss(toastId);
          toast.error(
            <div className="relative w-[280px] text-center">
              <div className="font-medium">다운로드 취소됨</div>
              <div className="text-sm text-gray-600">{fileName}</div>
            </div>,
            { duration: 3000 }
          );
        }}
        className="absolute top-0 right-0 !bg-gray-200 text-gray-700 hover:text-red-500 transition-colors text-sm font-bold w-6 h-6"
        title="다운로드 취소"
      >
        ×
      </Button>
      <div className="mb-2 font-medium">파일 다운로드 준비 중...</div>
      <div className="text-sm text-gray-600">{fileName}</div>
      <div className="text-xs text-gray-500">{fileSize}</div>
    </div>,
    {
      duration: Infinity,
    }
  );

  try {
    // 시뮬레이션된 다운로드 진행률
    const simulateDownload = () => {
      return new Promise<void>((resolve, reject) => {
        let currentProgress = 0;
        downloadInterval = setInterval(() => {
          if (isCancelled) {
            reject(new Error('Download cancelled'));
            return;
          }

          currentProgress += Math.random() * 15;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(downloadInterval!);
            resolve();
          }

          // 진행률 업데이트
          toast.loading(
            <div className="relative w-[280px] text-center">
              <Button
                onClick={() => {
                  isCancelled = true;
                  if (downloadInterval) {
                    clearInterval(downloadInterval);
                  }
                  toast.dismiss(toastId);
                  toast.error(
                    <div className="relative w-[280px] text-center">
                      <div className="font-medium">다운로드 취소됨</div>
                      <div className="text-sm text-gray-600">{fileName}</div>
                    </div>,
                    { duration: 3000 }
                  );
                }}
                className="absolute top-0 right-0 !bg-gray-200 text-gray-700 hover:text-red-500 transition-colors text-sm font-bold w-4 h-6"
                title="다운로드 취소"
              >
                ×
              </Button>
              <div className="mb-2 font-medium">파일 다운로드 중...</div>
              <div className="text-sm text-gray-600 mb-2">{fileName}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{Math.round(currentProgress)}%</div>
            </div>,
            {
              id: toastId,
              duration: Infinity,
            }
          );
        }, 200);
      });
    };

    await simulateDownload();

    if (isCancelled) {
      return;
    }

    // // 실제 파일 다운로드 로직
    // const blob = new Blob(['테스트 파일 내용'], { type: 'text/plain' });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = fileName;
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);
    // document.body.removeChild(a);

    // 성공 메시지
    toast.success(
      <div className="relative w-[280px] text-center">
        <div className="font-medium">다운로드 완료!</div>
        <div className="text-sm text-gray-600">{fileName}</div>
        <div className="text-xs text-gray-500">파일이 성공적으로 다운로드되었습니다.</div>
      </div>,
      {
        id: toastId,
        duration: 4000,
      }
    );

  } catch (error) {
    if (error instanceof Error && error.message === 'Download cancelled') {
      return; // 취소된 경우 추가 처리하지 않음
    }
    
    // 오류 메시지
    toast.error(
      <div className="relative w-[280px] text-center">
        <div className="font-medium">다운로드 실패</div>
        <div className="text-sm text-gray-600">{fileName}</div>
        <div className="text-xs text-gray-500">파일 다운로드 중 오류가 발생했습니다.</div>
      </div>,
      {
        id: toastId,
        duration: 4000,
      }
    );
  }
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(params.data.fileName, params.data.filePath, params.data.fileSize)
            }}
            className="hover:bg-gray-100 p-1 rounded transition-colors"
            title={`Download ${params.data.fileName}`}
          >
            <Icon className="w-4 h-4 text-gray-500 hover:text-blue-600 transition-colors" />
          </Button>
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
    const target = event.event?.target as HTMLElement;
    const api = event.api;
    const clickedNode = event.node;
    const selectedNodes = api.getSelectedNodes();
    const isShift = (event.event as KeyboardEvent)?.shiftKey;
    const isCtrl = (event.event as KeyboardEvent)?.ctrlKey || (event.event as KeyboardEvent)?.metaKey;
    const selectedMap = selectedMapRef.current;
    const isSelected = selectedMap.get(clickedNode.id!);

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

  return {
    data,
    columnDefs,
    onRowClicked,
    onSelectionChanged
  };
};
