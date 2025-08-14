"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal, Shapes } from "lucide-react";

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
import { Category } from "@/types/movie";

export const getCategoryColumns = ({
    openDialog,
    openAlertDialog,
}: {
    openDialog: (category: Category | null) => void;
    openAlertDialog: (category: Category) => void;
}): ColumnDef<Category>[] => [
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
            accessorKey: "icon",
            header: "Icon",
            cell: ({ row }) => {
                const iconUrl = row.getValue("icon") as string;
                const categoryName = row.original.name;
                return iconUrl && iconUrl !== "categories-icons-default.png" ? (
                    <Image
                        src={`/images/categories/icons/${iconUrl}`}
                        alt={categoryName}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Shapes className="h-5 w-5 text-muted-foreground" />
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openDialog(category)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => openAlertDialog(category)}
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
