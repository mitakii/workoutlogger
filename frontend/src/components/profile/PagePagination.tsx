import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { PageSize } from "@/pages/UserProfilePage";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageLength: number;
};

const PagePagination = ({ page, setPage, pageLength }: Props) => {
  return (
    <div>
      <Pagination className="mt-2 mb-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={() => {
                if (page >= 1) setPage((prevPage) => prevPage - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={
                pageLength < PageSize
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={() => {
                if (pageLength >= PageSize) setPage((prevPage) => prevPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PagePagination;
