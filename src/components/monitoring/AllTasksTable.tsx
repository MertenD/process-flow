'use client'

import React from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {ArrowUpDown} from "lucide-react"
import {FlowElementInstanceWithFlowElement} from "@/app/[teamId]/monitoring/page";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const columns: ColumnDef<FlowElementInstanceWithFlowElement>[] = [
    {
        accessorKey: "flow_element.name",
        id: "flow_element.name",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const name = row.original.flow_element.name
            return name ? name : 'N/A'
        },
    },
    {
        accessorKey: "flow_element.type",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
    },
    {
        accessorKey: "flow_element.execution_mode",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Execution Mode
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const status = row.getValue("status") as string
            const statusMessage = row.original.status_message as string | null
            return <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium
                  ${status === 'Completed' ? 'bg-[#00C49F]' :
                            status === 'In Progress' ? 'bg-[#0088FE]' :
                                status === 'Todo' ? 'bg-[#0088FE]' :
                                    'bg-[#FFBB28]'}`}>
                            {status}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        { statusMessage ? statusMessage : "" }
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        },
    },
    {
        accessorKey: "created_at",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const date = new Date(row.getValue("created_at"))
            return date.toLocaleString()
        },
    },
    {
        accessorKey: "completed_at",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Completed At
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const date = row.getValue("completed_at") as string | null
            return date ? new Date(date).toLocaleString() : 'N/A'
        },
    },
]

export interface AllTasksTableProps {
    data: FlowElementInstanceWithFlowElement[]
}

export default function AllTasksTable({data}: AllTasksTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <div className="max-h-[500px] overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-white">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}