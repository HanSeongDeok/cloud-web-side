import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useDataTableStore } from "@/stores/useTableDataStore";
import { memo } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";

const PaginationComponent = memo(() => {
  const paginationInfo = useDataTableStore((state) => state.pagination);
  const setPaginationInfo = useDataTableStore((state) => state.setPagination);
  const visiblePageCount = 5;

  const startPage = Math.floor((paginationInfo.currentPage - 1) / visiblePageCount) * visiblePageCount + 1;
  const endPage = Math.min(startPage + visiblePageCount - 1, paginationInfo.totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > paginationInfo.totalPages) return;
    setPaginationInfo({ ...paginationInfo, currentPage: page });
  };

  const getPageWidthClass = () => {
    if (endPage >= 100000) return "min-w-[3.5rem] sm:min-w-[4rem] lg:min-w-[4.5rem]";
    if (endPage >= 10000) return "min-w-[3rem] sm:min-w-[3.5rem] lg:min-w-[4rem]";
    if (endPage >= 1000) return "min-w-[2.5rem] sm:min-w-[3rem] lg:min-w-[3.5rem]";
    if (endPage >= 100) return "min-w-[2rem] sm:min-w-[2.5rem] lg:min-w-[3rem]";
    return "min-w-[2rem] sm:min-w-[2.5rem] lg:min-w-[3rem]";
  };

  return (
    <Pagination className="flex justify-center">
      <PaginationContent className="flex justify-center gap-2 sm:gap-3">
        {/* << 처음으로 */}
        <PaginationItem>
          <Button
            onClick={() => goToPage(1)}
            variant="ghost"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronsLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
          </Button>
        </PaginationItem>

        {/* < 이전 */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(paginationInfo.currentPage - 1);
            }}
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 cursor-pointer mr-2 sm:mr-3 lg:mr-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
          </PaginationPrevious>
        </PaginationItem>

        {/* 페이지 번호 */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === paginationInfo.currentPage}
              onClick={async (e) => {
                e.preventDefault();
                goToPage(page);

              }}
              className={`${getPageWidthClass()} text-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 text-sm sm:text-base lg:text-lg font-medium transition-colors`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 페이지 번호 끝 */}
        {endPage < paginationInfo.totalPages && (
          <>
            <PaginationItem className="mr-2 sm:mr-3 lg:mr-4">
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem className="mr-2 sm:mr-3">
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(paginationInfo.totalPages);
                }}
                className={`${getPageWidthClass()} text-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 text-sm sm:text-base lg:text-lg font-medium transition-colors`}
              >
                {paginationInfo.totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* > 다음  */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(paginationInfo.currentPage + 1);
            }}
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 cursor-pointer ml-2 sm:ml-3 lg:ml-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
          </PaginationNext>
        </PaginationItem>

        {/* > 마지막으로 */}
        <PaginationItem>
          <Button
            onClick={() => goToPage(paginationInfo.totalPages)}
            variant="ghost"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
});

export default PaginationComponent;



