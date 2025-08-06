'use client'

import { getPagesToShow } from "@/app/helper/common"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"
type Props<TData> = {
    totalPages?: number,
    currentPage?: number,
    table: Table<TData>,
    isLoading?: boolean,
    handleChangeCurrentPage: (pageIndex: number) => void,
    handleChangePageSize: (pageSize: number) => void,
}


export function PaginationPage<TData>({
    currentPage,
    totalPages,
    table,
    handleChangeCurrentPage,
    handleChangePageSize,
    isLoading = false,
}: Props<TData>) {
    const defaultText = "—"
    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
                {isLoading
                    ? `${defaultText} of ${defaultText} row(s) selected.`
                    : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        disabled={isLoading}
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            const size = Number(value)
                            table.setPageSize(size)
                            handleChangePageSize(size)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {isLoading ? defaultText : currentPage} of{" "}
                    {isLoading ? defaultText : (totalPages && totalPages / (table.getState().pagination.pageSize / 10))}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => handleChangeCurrentPage(1)}
                        disabled={isLoading || currentPage <= 1}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => handleChangeCurrentPage(currentPage - 1)}
                        disabled={isLoading || currentPage <= 1}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => handleChangeCurrentPage(currentPage + 1)}
                        disabled={isLoading || currentPage >= totalPages}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => handleChangeCurrentPage(totalPages)}
                        disabled={isLoading || currentPage >= totalPages}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

