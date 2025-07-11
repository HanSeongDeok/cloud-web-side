import { memo, useRef, useState } from "react";
import DataTable from "@/components/DataTable";
import DataInput from "./DataInput";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { TableDropDownMenu } from "./DropDownMenu";
import { handleFileSelect } from "@/handlers/file.upload.handler";
import VehicleTypeMultiSelect from "./VehicleTypeMultiSelect";
import ECUTypeMultiSelect from "./ECUTypeMultiSelect";
import StepMultiSelect from "./StepMultiSelect";
import BadgeButtons from "./BadgeButton";
import UploadButton from "./UploadButton";

const ProtoPage1 = memo(() => {
    return (
        <div className="w-full px-6 py-8">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-6">중앙 집중형관리 시스템 저장소</h1>
                <p className="text-muted-foreground">
                    welcome to the CTM storage
                </p>
            </div>
            
            {/* 필터 검색 영역 */}
            <div className="flex justify-center w-full mb-25">
                <div className="flex flex-col items-start w-[1000px]">
                    <BadgeButtons/>
                    <DataInput />
                    <div className="flex flex-row gap-x-4 mt-2">
                        <VehicleTypeMultiSelect/>
                        <ECUTypeMultiSelect/>
                        <StepMultiSelect/>
                    </div>
                </div>
            </div>

            {/* 테이블 컬럼 / 업로드 영역 */}
            <div className="table-container">
                <div className="flex gap-2 ml-auto">
                    <UploadButton/>
                    <TableDropDownMenu />
                </div>
            </div>

            {/* 테이블 영역 */}
            <div className="space-y-8">
                <DataTable />
            </div>
        </div>
    )
});

export default ProtoPage1;