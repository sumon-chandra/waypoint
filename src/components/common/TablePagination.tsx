"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  entityLabel?: string;
  className?: string;
}

export function TablePagination({
  totalItems,
  itemsPerPage = 15,
  currentPage,
  onPageChange,
  entityLabel = "items",
  className,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  // Generate pagination page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 text-xs text-muted-foreground",
        className
      )}
    >
      {/* Results Count */}
      <div className="text-center sm:text-left">
        Showing{" "}
        <span className="font-bold text-foreground font-mono">{startItem}</span> to{" "}
        <span className="font-bold text-foreground font-mono">{endItem}</span> of{" "}
        <span className="font-bold text-foreground font-mono">{totalItems}</span> {entityLabel}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* First page */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage <= 1}
          className="size-8 rounded-xl cursor-pointer"
          title="First page"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>

        {/* Previous page */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="size-8 rounded-xl cursor-pointer"
          title="Previous page"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        {/* Numbered buttons */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-muted-foreground text-xs select-none"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === safeCurrentPage;
            return (
              <Button
                key={`page-${p}`}
                type="button"
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(p)}
                className={cn(
                  "size-8 rounded-xl p-0 font-bold text-xs cursor-pointer",
                  isCurrent && "shadow-xs pointer-events-none"
                )}
              >
                {p}
              </Button>
            );
          })}
        </div>

        {/* Next page */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className="size-8 rounded-xl cursor-pointer"
          title="Next page"
        >
          <ChevronRight className="size-3.5" />
        </Button>

        {/* Last page */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={safeCurrentPage >= totalPages}
          className="size-8 rounded-xl cursor-pointer"
          title="Last page"
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
