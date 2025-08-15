import { memo } from "react";
import DataTable from "@/components/DataTable";
import DataInput from "../DataInput";
import { TableDropDownMenu } from "../DropDownMenu";
import VehicleTypeMultiSelect from "../VehicleTypeMultiSelect";
import ECUTypeMultiSelect from "../ECUTypeMultiSelect";
import StepMultiSelect from "../StepMultiSelect";
import BadgeButtons from "../BadgeButton";
import UploadButton from "../UploadButton";
import PaginationComponent from "../Pagination";

const StoragePage = memo(() => {
  return (
    <main className="min-h-screen p-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-6">
          중앙 집중형관리 시스템 저장소
        </h1>
        <p className="text-muted-foreground">welcome to the CTM storage</p>
      </div>

      {/* 필터 검색 영역 */}
      <div className="w-full mb-10">
        <div className="flex flex-col items-start w-full">
          <BadgeButtons />
          <DataInput />
          <div className="flex flex-row gap-x-4 mt-2 w-full">
            <VehicleTypeMultiSelect />
            <ECUTypeMultiSelect />
            <StepMultiSelect />
          </div>
        </div>
      </div>

      {/* 테이블 컬럼 / 업로드 영역 */}
      <div className="table-container">
        <div className="flex gap-2 ml-auto">
          <UploadButton />
          <TableDropDownMenu />
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="flex flex-col w-full h-[700px]">
        <div>
          <DataTable />
        </div>
        <div className="mt-2 mb-10">
          <PaginationComponent />
        </div>
      </div>
    </main>
  );
});

export default StoragePage;
