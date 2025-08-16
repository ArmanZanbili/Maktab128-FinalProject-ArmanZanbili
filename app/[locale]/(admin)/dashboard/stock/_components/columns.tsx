"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTableColumnHeader } from "@/src/components/data-table/data-table-column-header";
import { Movie } from "@/types/movie";
import { EditableCell } from "./editable-cell";


type ChangedProducts = {
    [productId: string]: {
        price?: number;
        quantity?: number;
    };
};

export const getStockColumns = ({
    handleCellUpdate,
    changedProducts,
}: {
    handleCellUpdate: (productId: string, field: 'price' | 'quantity', value: string) => void;
    changedProducts: ChangedProducts;
}): ColumnDef<Movie>[] => [
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
                    <Image
                        alt={row.original.name}
                        className="aspect-square rounded-md object-cover"
                        height="40"
                        src={imageUrl}
                        width="40"
                        onError={(e) => { console.error('Image failed to load:', e.currentTarget.src); }}
                    />
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
            cell: ({ row }) => (
                <EditableCell
                    initialValue={row.original.price}
                    onSave={(value: string) => handleCellUpdate(row.original._id, 'price', value)}
                    isChanged={Object.prototype.hasOwnProperty.call(changedProducts[row.original._id] ?? {}, 'price')}
                    type="number"
                    prefix="$"
                />
            ),
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
            cell: ({ row }) => (
                <EditableCell
                    initialValue={row.original.quantity}
                    onSave={(value: string) => handleCellUpdate(row.original._id, 'quantity', value)}
                    isChanged={Object.prototype.hasOwnProperty.call(changedProducts[row.original._id] ?? {}, 'quantity')}
                    type="number"
                />
            ),
        },
    ];