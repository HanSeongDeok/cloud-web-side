import * as React from "react"
import { useEffect, useRef } from "react"
import { AgGridReact } from "ag-grid-react"
import { Button } from "@/components/ui/button"
import { useAgGrid, columnDefs } from "@/handlers/dataTable.config.handler"
import "@/styles/DataTable.css"
import DataInput from "@/components/DataInput"
import { useAccordionStore } from "@/stores/useAccordionStore"
import { TableDropDownMenu } from "@/components/DropDownMenu"
import { Download, Upload } from "lucide-react"

const DataTable = React.memo(() => {
  const { data, columnDefs, onGridReady, addNewFile, gridApi } = useAgGrid();
  const openItems = useAccordionStore((state) => state.openItems);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('Accordion state changed:', openItems);
  }, [openItems]);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      saveFileToDatabase(file);
    }
  };

  const saveFileToDatabase = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);

      const fileData = {
        id: generateId(),
        download: Download,
        fileName: file.name,
        filePath: `uploads/${file.name}`,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        fileType: file.type,
        testType: "uploaded",
        vehicle: "N/A",
        step: "upload",
        ecu: "N/A",
        swVersion: "1.0",
        testName: file.name,
        description: `Uploaded file: ${file.name}`,
        memoryType: "N/A",
        user: "current_user",
        createdAt: new Date(),
        status: "success" as const,
        email: "user@example.com",
        fileContent: base64
      };

      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData)
      });

      if (response.ok) {
        addNewFile(fileData);
        alert(`파일 "${file.name}"이 성공적으로 업로드되었습니다!`);
      } else {
        console.error('파일 저장 실패:', response.statusText);
        alert('파일 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('파일 저장 중 오류 발생:', error);
      alert('파일 저장 중 오류가 발생했습니다.');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const generateId = (): string => {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div>
      <div className="table-container">
        <DataInput />
        <div className="flex gap-2 ml-auto">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden-file-input"
            accept="*/*"
            aria-label="파일 선택"
          />
          <Button
            variant="outline"
            size="default"
            onClick={handleFileUpload}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <TableDropDownMenu />
        </div>
      </div>

      <div className="ag-theme-quartz ag-grid-container">
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true
          }}
        />
      </div>
    </div>
  )
});

export default DataTable;