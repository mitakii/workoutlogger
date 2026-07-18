import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { PAGE_SIZE } from "@/lib/constants";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageLength: number;
  pageSize?: number;
};

const PagePagination = ({
  page,
  setPage,
  pageLength,
  pageSize = PAGE_SIZE,
}: Props) => {
  const hasPreviousPage = page > 1;
  const hasNextPage = pageLength >= pageSize;

  return (
    <div>
      <Pagination className="mt-2 mb-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                hasPreviousPage ? undefined : "pointer-events-none opacity-50"
              }
              onClick={() => {
                if (hasPreviousPage) setPage((prevPage) => prevPage - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={
                hasNextPage ? undefined : "pointer-events-none opacity-50"
              }
              onClick={() => {
                if (hasNextPage) setPage((prevPage) => prevPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PagePagination;
