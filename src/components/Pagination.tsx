import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePaginationStore } from "@/stores/usePaginationState ";
import { memo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";

const PaginationComponent = memo(() => {
  const pageSize = usePaginationStore((state) => state.pageSize);
  const totalRow = usePaginationStore((state) => state.totalRow);

  const currentPage = usePaginationStore((state) => state.currentPage);
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);

  const totalPages = Math.ceil(totalRow / pageSize);
  const visiblePageCount = 5;

  const startPage = Math.floor((currentPage-1) / visiblePageCount) * visiblePageCount + 1;
  const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageWidthClass = () => {
    if (endPage >= 100000) return "min-w-[4rem] ";
    if (endPage >= 10000) return "min-w-[3rem] ";
    if (endPage >= 1000) return "min-w-[2rem] ";
    if (endPage >= 100) return "min-w-[1.5rem] ";
    return "min-w-[1rem] ";
  };

  return (
    <Pagination className="flex justify-center scale-150">
      <PaginationContent className="flex justify-center gap-x-1">
        {/* << 처음으로 */}
        <PaginationItem>
          <Button
            onClick={() => goToPage(1)}
            variant="ghost"
            className="w-8 h-8 p-0 cursor-pointer border border-gray-300 rounded-sm"
          >
            <ChevronsLeft className="h-4 w-4 text-white" />
          </Button>
        </PaginationItem>
        {/* < 이전 */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage - 1);
            }}
            className="w-8 h-8 p-0 cursor-pointer mr-3 border border-gray-300 rounded-sm"
          >
          </PaginationPrevious>
        </PaginationItem>
        {/* 페이지 번호 */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                goToPage(page);
              }}
              className={`${getPageWidthClass()} text-center w-8 h-8 p-0 `}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* 페이지 번호 끝 */}
        {endPage < totalPages && (
          <>
            <PaginationItem className="mr-3">
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem className="mr-2">
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(totalPages);
                }}
                className={`${getPageWidthClass()} text-center w-8 h-8 p-0 `}
              >
                {totalPages}
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
              goToPage(currentPage + 1);
            }}
            className="w-8 h-8 p-0 cursor-pointer ml-3 border border-gray-300 rounded-sm"
          > 
          </PaginationNext>
        </PaginationItem>
        {/* > 마지막으로 */}
        <PaginationItem>
          <Button
            onClick={() => goToPage(totalPages)}
            variant="ghost"
            className="w-8 h-8 p-0 cursor-pointer border border-gray-300 rounded-sm"
          >
            <ChevronsRight className="h-4 w-4 text-white" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
});

export default PaginationComponent;



