import type { SearchInfoBody, PaginationInfo } from "@/stores/useTableDataStore";

interface SearchModeType {
    BASIC_SEARCH: string,
    ONLY_QUICK_FILTER: string
}; 

const SearchMode: SearchModeType = {
    BASIC_SEARCH: "BASIC_SEARCH",
    ONLY_QUICK_FILTER: "ONLY_QUICK_FILTER"
} as const;

export const convertSearchMode = (keyword: string): string => {
    return (keyword === "" || keyword === null || keyword === undefined) ? 
        SearchMode.ONLY_QUICK_FILTER :          
        SearchMode.BASIC_SEARCH;
};

/**
 * 필터 검색을 위한 공통 함수
 * @param filterSelected - 선택된 필터 정보
 * @param page - 현재 페이지
 * @param pageSize - 페이지 크기
 * @param setDataTableData - 데이터 테이블 데이터 설정 함수
 */
export const createfiterInfo = (
    filterSelected: Map<string, string[]>,
    paginationInfo: PaginationInfo,
    searchKeyword: string,
    mode: string,
    searchTarget?: string
): SearchInfoBody | null => {
        try {
            const quickFilter: Record<string, string[]> = {};
            filterSelected.forEach((values, key) => {
                if (values.length > 0) {
                    quickFilter[key] = values;
                }
            });

            const filterInfo: SearchInfoBody = {
                mode: mode,
                paging: { 
                    page: paginationInfo.currentPage - 1, 
                    size: paginationInfo.pageSize 
                },
                ...(mode === SearchMode.BASIC_SEARCH
                    ? { q: searchKeyword, searchTarget: searchTarget || "ALL" }
                    : {}),
                ...quickFilter
            };
            return filterInfo;
        } catch (error) {
            console.error('Filter search failed:', error);
            return null as unknown as SearchInfoBody;
        }
};