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

  return (
    <Pagination className="flex justify-center scale-150">
      <PaginationContent className="flex justify-center gap-x-1">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage - 1);
            }} />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                goToPage(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
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
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage + 1);
            }} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
});

export default PaginationComponent;


