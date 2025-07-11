'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getPagesToShow } from "../lib/helper"
import { cn } from "@/lib/utils"

type Props = {
    totalPages:number,
    currentPage:number,
    onPageChange?: (page: number) => void
}


export function PaginationPage({currentPage,totalPages,onPageChange}:Props) {
    const pagesToShow = getPagesToShow({currentPage, totalPages})
    return (
        <Pagination className="mt-4">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                <PaginationPrevious
                    href={`?page=${currentPage - 1}`}
                    onClick={(e) => {
                        if(currentPage <=1)
                        e.preventDefault();
                        else onPageChange?.(currentPage - 1);
                    }}
                    className={
                        cn("cursor-pointer", (currentPage <= 1) && "cursor-not-allowed")
                    }
                    // disabled={currentPage === 1}
                />
                </PaginationItem>

                {/* Page Numbers */}
                {pagesToShow?.map((page, index) =>
                page === "..." ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                    </PaginationItem>
                ) : (
                    <PaginationItem key={page}>
                    <PaginationLink
                        href={`?page=${page}`}
                        isActive={page === currentPage}
                        onClick={() =>  onPageChange?.(page)}
                    >
                        {page}
                    </PaginationLink>
                    </PaginationItem>
                )
                )}

                {/* Next */}
                <PaginationItem>
                <PaginationNext
                    href={`?page=${currentPage + 1}`}
                    onClick={(e) => {
                        if(currentPage === totalPages)
                        e.preventDefault();
                        onPageChange?.(Math.min(currentPage + 1, totalPages))}
                    }
                    className={
                        cn("cursor-pointer", (totalPages === currentPage) && "cursor-not-allowed")
                    }
                />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
