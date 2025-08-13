"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { PaginationPage } from "./pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant"

interface CustomColumnDef<TData, TValue> extends ColumnDef<TData, TValue> {
    enableSelection?: boolean
    enableSorting?: boolean
}

interface DialogState {
  edit: boolean;
  delete: boolean;
  view: boolean;
}

interface DataTableProps<TData, TValue> {
    columns: CustomColumnDef<TData, TValue>[]
    data: TData[],
    pageCount: number | undefined,
    handleChangeCurrentPage: (pageIndex: number) => void,
    handleChangePageSize: (pageSize: number) => void,
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<{
        comments: Comment;
        count: number;
    }, Error>>
    isLoading?: boolean,
    currentPage: number
    pageSize: number,
    handleShowDialog?: (key: keyof DialogState, value: boolean, dataResponse: any) => void;
}

const TableShadcn = <TData, TValue>({
    columns,
    data,
    pageCount,
    handleChangeCurrentPage,
    handleChangePageSize,
    refetch,
    isLoading,
    currentPage,
    pageSize, 
    handleShowDialog

}: DataTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: +DEFAULT_PAGE - 1,
        pageSize: DEFAULT_PAGESIZE,
    })
    useEffect(() => {
        handleChangeCurrentPage(pagination.pageIndex + 1)
        handleChangePageSize(pagination.pageSize)
        refetch()
    }, [pagination])
    const enhancedColumns: ColumnDef<TData, TValue>[] = columns.map((col) => {
        if (isLoading) {
            return {
            ...col,
            header: typeof col.header === "string" || typeof col.header === "function"
                ? col.header
                : () => <div className="h-4 w-20 bg-muted rounded-sm animate-pulse" />,
            cell: () => <div className="h-4 w-full bg-muted rounded-sm animate-pulse" />,
            }
        }
        if (col.enableSorting) {
            return {
                ...col,
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {String(!!col.header ? col?.header : column.id)}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
            }
        }
        if (col?.enableSelection) {
            return {
                // id: typeof col?.accessorKey === 'string' ? col?.accessorKey : col?.id ?? 'select',
                ...col,
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table?.getIsAllPageRowsSelected() ||
                            (table?.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
            }
        }
        if (col?.accessorKey === "action" || col?.id === "action") {
            return {
                ...col,
                cell: ({ row }) => {
                    const item = row.original
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <EllipsisVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleShowDialog?.('view', true, item)}>
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShowDialog?.('edit',true, item)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() => handleShowDialog?.('delete',true, item)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
            }
        }
        return col
    })
    const table = useReactTable({
        data: data ?? [],
        columns: enhancedColumns,
        pageCount,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row?.id as string,
        state: {
            sorting,
            rowSelection,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: pageSize,
            },
        },
    })
    // const selectedRows = table?.getSelectedRowModel().rows.map(row => row.original) : 
    return (
        <div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table?.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {!isLoading && table?.getRowModel()?.rows?.length > 0 ? (
                            table?.getRowModel()?.rows?.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isLoading ? "Loading..." : "No results."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            </div>
            <PaginationPage 
                isLoading={isLoading} 
                table={table} 
                handleChangePageSize={handleChangePageSize} 
                handleChangeCurrentPage={handleChangeCurrentPage}
                totalPages={pageCount}
                currentPage={currentPage}
            />
        </div>
    )
}

export default TableShadcn