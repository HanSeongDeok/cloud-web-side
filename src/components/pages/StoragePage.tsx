import { memo } from "react";
import DataTable from "@/components/tables/DataTable";
import DataInput from "../searchs/DataInput";
import { TableColumnSetting } from "../tables/TableColumnSetting";
import FilterColumnHeader from "../filter/FilterColumnHeader";
import FilterLut from "../filter/FilterLut";
import FilterBadgeButton from "../filter/FilterBadgeButton";
import UploadButton from "../uploads/UploadButton";
import PaginationComponent from "../tables/Pagination";
import { Label } from "../ui/label";

const StoragePage = memo(() => {
  return (
    <main className="min-h-screen p-8 mt-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4">
          중앙 집중형관리 시스템 저장소
        </h1>
        <p className="text-muted-foreground mb-10">welcome to the VTDM storage</p>
      </div>

      {/* 필터 검색 영역 */}
      <div className="w-full mb-20">
        <div className="flex flex-col items-start w-full">
          <FilterBadgeButton />
          <DataInput />
          <div className="flex flex-row gap-x-2 w-full justify-center mt-2 pr-15">
            {/* <TypeMultiSelect /> */}
            <Label className="text-xl font-medium text-gray-600">필터</Label>
            <div className="h-10 w-0.5 bg-gray-300 mx-3 font-bold"></div>
            <FilterColumnHeader />
            <FilterLut />
          </div>
        </div>
      </div>

      {/* 테이블 컬럼 / 업로드 영역 */}
      <div className="flex justify-end w-full mb-4 pr-2">
        <div className="flex gap-4">
          <UploadButton />
          <TableColumnSetting />
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
