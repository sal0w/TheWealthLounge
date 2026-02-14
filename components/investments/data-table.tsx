"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, SlidersHorizontal, Download } from "lucide-react"
import { InvestmentDetailDialog } from "./investment-detail-dialog"
import { InvestmentWithProduct } from "@/lib/types"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedInvestment, setSelectedInvestment] = React.useState<InvestmentWithProduct | null>(null)
    const [showDetails, setShowDetails] = React.useState(false)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const headerGroups = table.getHeaderGroups();
    console.log("Header Groups:", headerGroups);
    if (headerGroups.length > 0) {
        console.log("Group 0 Headers:", headerGroups[0].headers);
        console.log("Group 0 Headers Length:", headerGroups[0].headers.length);
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center py-4 justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Filter by company..."
                        value={(table.getColumn("product_investmentCompany")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("product_investmentCompany")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800">
                                Currency
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-slate-900 border-slate-800 text-slate-200">
                            <DropdownMenuLabel>Filter by Currency</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuRadioGroup
                                value={(table.getColumn("currency")?.getFilterValue() as string) ?? "all"}
                                onValueChange={(value) => {
                                    table.getColumn("currency")?.setFilterValue(value === "all" ? "" : value)
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="cursor-pointer">
                                    All Currencies
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="USD" className="cursor-pointer">
                                    USD - US Dollar
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="EUR" className="cursor-pointer">
                                    EUR - Euro
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="GBP" className="cursor-pointer">
                                    GBP - Pound
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800">
                                Year
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-slate-900 border-slate-800 text-slate-200">
                            <DropdownMenuLabel>Filter by Projection Year</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuRadioGroup
                                value={(table.getColumn("projectionYears")?.getFilterValue() as string) ?? "all"}
                                onValueChange={(value) => {
                                    table.getColumn("projectionYears")?.setFilterValue(value === "all" ? "" : value)
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="cursor-pointer">
                                    All Years
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="2025" className="cursor-pointer">
                                    2025
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="2026" className="cursor-pointer">
                                    2026
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="2027" className="cursor-pointer">
                                    2027
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="2028" className="cursor-pointer">
                                    2028
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="2029" className="cursor-pointer">
                                    2029
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
                        onClick={() => {
                            const headers = ["ID", "Category", "Company", "Amount", "Currency", "USD Equiv", "Status"]
                            const rows = table.getFilteredRowModel().rows.map(row => [
                                (row.original as any).id,
                                (row.original as any).product.category,
                                (row.original as any).product.investmentCompany,
                                (row.original as any).amountInvested,
                                (row.original as any).currency,
                                (row.original as any).usdEquivalent,
                                (row.original as any).status
                            ])
                            const csvContent = "data:text/csv;charset=utf-8,"
                                + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
                            const encodedUri = encodeURI(csvContent)
                            const link = document.createElement("a")
                            link.setAttribute("href", encodedUri)
                            link.setAttribute("download", "investments.csv")
                            document.body.appendChild(link)
                            link.click()
                        }}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-900 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-950">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-slate-800 hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="text-slate-400 border-r border-slate-800/50 last:border-0 align-middle"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    onClick={() => {
                                        setSelectedInvestment(row.original as InvestmentWithProduct)
                                        setShowDetails(true)
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-slate-500"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-slate-900 border-slate-800 text-slate-200"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="bg-slate-900 border-slate-800 text-slate-200"
                    >
                        Next
                    </Button>
                </div>
            </div>
            
            {selectedInvestment && (
                <InvestmentDetailDialog
                    open={showDetails}
                    onOpenChange={setShowDetails}
                    investment={selectedInvestment}
                />
            )}
        </div>
    )
}
