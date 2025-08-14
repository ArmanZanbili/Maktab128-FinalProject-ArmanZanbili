"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/src/components/data-table/data-table-column-header";
import { Movie } from "@/types/movie";

export const getMovieColumns = ({
    openDialog,
    openAlertDialog,
    openImagePreview,
}: {
    openDialog: (movie: Movie | null) => void;
    openAlertDialog: (movie: Movie) => void;
    openImagePreview: (imageUrl: string) => void;
}): ColumnDef<Movie>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            accessorKey: "thumbnail",
            header: "Image",
            cell: ({ row }) => {
                const thumbnail = row.getValue("thumbnail") as string;
                const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
                const imageUrl = thumbnail.startsWith('http')
                    ? thumbnail
                    : `${backendBaseUrl}/images/products/thumbnails/${thumbnail}`;

                return (
                    <button
                        onClick={() => openImagePreview(imageUrl)}
                        className="h-10 w-10 overflow-hidden rounded-md p-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:cursor-pointer"
                    >
                        <Image
                            alt={row.original.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={imageUrl}
                            width="64"
                            onError={(e) => { console.error('Image failed to load:', e.currentTarget.src); }}
                        />
                    </button>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        },
        {
            accessorKey: "price",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("price"));
                const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const movie = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted text-muted-foreground flex size-8">
                                    <EllipsisVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openDialog(movie)}>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" onClick={() => openAlertDialog(movie)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];