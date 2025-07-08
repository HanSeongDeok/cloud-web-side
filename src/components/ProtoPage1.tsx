import { memo, useRef } from "react";
import DataTable from "@/components/DataTable";
import DataInput from "./DataInput";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { TableDropDownMenu } from "./DropDownMenu";
import { handleFileSelect} from "@/handlers/file.upload.handler";

const ProtoPage1 = memo(() => {
    const fileInput = useRef<HTMLInputElement>(null);
    const handleFileUpload = (fileInputRef: React.RefObject<HTMLInputElement>) => {
        fileInputRef.current?.click();
    };
    return (
        <div className="w-full px-6 py-8">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-6">중앙 집중형관리 시스템 저장소</h1>
                <p className="text-muted-foreground">
                    welcome to the CTM storage
                </p>
            </div>
            <div className="flex justify-center w-full mb-25">
                <DataInput />
            </div>

            <div className="table-container">
                <div className="flex gap-2 ml-auto">
                    <input
                        ref={fileInput}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden-file-input"
                        accept="*/*"
                        aria-label="파일 선택"
                    />
                    <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleFileUpload(fileInput)}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                    <TableDropDownMenu />
                </div>
            </div>

            <div className="space-y-8">
                <DataTable />
            </div>
        </div>
    )
});

export default ProtoPage1;