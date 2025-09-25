import { Label } from "@radix-ui/react-dropdown-menu";
import FilterBadgeButton from "../filter/FilterBadgeButton";
import DataInput from "../searchs/DataInput";
import FilterColumnHeader from "../filter/FilterColumnHeader";
import FilterLut from "../filter/FilterLut";

const DashboardHeader: React.FC = () => {
  return (
    <div className="w-2/3 mx-auto mb-20">
      <div className="flex flex-col items-start w-full">
        <FilterBadgeButton pageType={"Dashboard"} />
        <DataInput pageType={"Dashboard"} />
        <div className="flex flex-row gap-x-2 w-full justify-center mt-2 pr-15">
          {/* <TypeMultiSelect /> */}
          <Label className="text-xl font-medium text-gray-600">필터</Label>
          <div className="h-10 w-0.5 bg-gray-300 mx-3 font-bold"></div>
          <FilterColumnHeader />
          <FilterLut pageType={"Dashboard"} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
