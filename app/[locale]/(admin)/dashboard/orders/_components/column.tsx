"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import { ArrowUpDown, CheckCircle2, Truck } from "lucide-react";
import { Order } from "@/types/order";
import moment from 'jalali-moment';

const formatJalali = (date: string) => {
    return moment(date).locale('fa').format('YYYY/MM/DD - HH:mm');
}

export const getOrderColumns = (
    markAsDelivered: (orderId: string) => void
): ColumnDef<Order>[] => [
        {
            accessorKey: "user.firstname",
            header: "Customer",
            cell: ({ row }) => {
                const user = row.original.user;
                return <div>{user.firstname} {user.lastname}</div>;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Order Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{formatJalali(row.getValue("createdAt"))}</div>,
        },
        {
            accessorKey: "totalPrice",
            header: "Total Price",
            cell: ({ row }) => {
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(row.getValue("totalPrice"));
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: "deliveryStatus",
            header: "Status",
            cell: ({ row }) => {
                const isDelivered = row.getValue("deliveryStatus");
                return isDelivered ? (
                    <span className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Delivered on {formatJalali(row.original.updatedAt)}
                    </span>
                ) : (
                    <span className="text-orange-600">Processing</span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const order = row.original;
                if (order.deliveryStatus) {
                    return null;
                }
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsDelivered(order._id)}
                    >
                        <Truck className="mr-2 h-4 w-4" /> Mark as Delivered
                    </Button>
                );
            },
        },
    ];