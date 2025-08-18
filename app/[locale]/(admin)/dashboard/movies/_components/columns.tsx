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
    openImagePicker,
}: {
    openDialog: (movie: Movie | null) => void;
    openAlertDialog: (movie: Movie) => void;
    openImagePicker: (movie: Movie) => void;
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
                const movie = row.original;
                const thumbnail = movie.thumbnail;
                const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');

                const imageUrl = thumbnail.startsWith('http') || thumbnail.startsWith('blob:')
                    ? thumbnail
                    : `${backendBaseUrl}/images/products/thumbnails/${thumbnail}`;

                return (
                    <button
                        onClick={() => openImagePicker(movie)}
                        className="relative h-10 w-10 overflow-hidden rounded-md p-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:cursor-pointer group"
                    >
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </div>
                        <Image
                            alt={movie.name}
                            src={imageUrl}
                            fill
                            className="rounded-md object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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