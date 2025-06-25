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
 * 다운로드 컬럼 생성
 * @returns 다운로드 컬럼
 */
const createDownloadColumn = (): ColDef<Payment> => {
  return {
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
 * 파일경로 컬럼 생성
 * @returns 파일경로 컬럼
 */
const createFilePathColumn = (): ColDef<Payment> => {
  return { 
    headerName: 'File Path', 
    field: 'filePath', 
    width: 200, 
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

// ✅ ag-grid 컬럼 정의
export const columnDefs: ColDef<Payment>[] = [
  createCheckbox(),
  createDownloadColumn(),
  createFileNameColumn(),
  createFilePathColumn(),
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
