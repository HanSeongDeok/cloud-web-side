import type { FilterSearchBody, PaginationInfo } from "@/stores/useTableDataStore";

/**
 * 필터 검색을 위한 공통 함수
 * @param stepSelected - 선택된 단계 정보
 * @param page - 현재 페이지
 * @param pageSize - 페이지 크기
 * @param setDataTableData - 데이터 테이블 데이터 설정 함수
 */
export const createfiterInfo = (
    stepSelected: Map<string, string[]>,
    paginationInfo: PaginationInfo
): FilterSearchBody | null => {
        try {
            const quickFilter: Record<string, string[]> = {};
            stepSelected.forEach((values, key) => {
                if (values.length > 0) {
                    quickFilter[key] = values;
                }
            });

            const filterInfo: FilterSearchBody = {
                mode: "ONLY_QUICK_FILTER",
                paging: { 
                    page: paginationInfo.currentPage - 1, 
                    size: paginationInfo.pageSize 
                }, 
                quickFilter: quickFilter    
            };

            return filterInfo;
        } catch (error) {
            console.error('Filter search failed:', error);
            return null as unknown as FilterSearchBody;
        }
};