import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Search } from "lucide-react";
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";
import { useDataTableStore, type SearchInfoBody } from "@/stores/useTableDataStore";
import { useFilterLutSelectionStore } from "@/stores/useSelectionStore";
import { createfiterInfo } from "@/handlers/events/filterSearch.service.handler";
import AdvancedSearch from "./AdvancedSearch";

/**
 * 데이터 입력 컴포넌트 - ag-grid용
 * @returns 데이터 입력 컴포넌트
 */
const DataInput = () => {
    const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);
    const setSearchKeyword = useSearchKeywordStore((state) => state.setSearchKeyword);
    const fetchSearchData = useDataTableStore((state) => state.fetchSearchData);

    const paginationInfo = useDataTableStore((state) => state.pagination);
    const filterLutSected = useFilterLutSelectionStore((state) => state.selected);

    const handleSearch = () => {
        console.log(paginationInfo);
        console.log(filterLutSected);
        console.log(searchKeyword);

        const basicSearchInfo = createfiterInfo(filterLutSected, paginationInfo, searchKeyword, "BASIC_SEARCH");
        fetchSearchData(basicSearchInfo as SearchInfoBody);
    };

    return (
        <div className="flex justify-center w-full mb-4">
            <div className="relative w-full">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.preventDefault()}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100"
                >
                    <Search className="!h-5 !w-5" />
                </Button>
                <Input
                    placeholder="Filter data..."
                    value={searchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    className="w-full h-15 !text-lg pl-13 pr-13 border-gray-400/50 focus:border-gray-400/60 focus:ring-1 focus:ring-blue-200/20"
                />
                <AdvancedSearch />
            </div>
        </div>
    );
};

export default DataInput;