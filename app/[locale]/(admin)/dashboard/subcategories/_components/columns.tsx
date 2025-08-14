"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/src/components/data-table/data-table-column-header";
import { Subcategory } from "@/types/movie";
import { Badge } from "@/src/components/ui/badge";

export const getSubcategoryColumns = ({
    openDialog,
    openAlertDialog,
    categoryNameMap,
}: {
    openDialog: (subcategory: Subcategory | null) => void;
    openAlertDialog: (subcategory: Subcategory) => void;
    categoryNameMap: Map<string, string>;
}): ColumnDef<Subcategory>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
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
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Parent Category" />
            ),
            cell: ({ row }) => {
                const category = row.original.category as string;
                const categoryName = categoryNameMap.get(category);
                return <Badge variant="outline">{categoryName || 'N/A'}</Badge>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const subcategory = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                >
                                    <EllipsisVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openDialog(subcategory)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => openAlertDialog(subcategory)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
