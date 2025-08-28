"use client";

import * as React from "react";
import { toast } from "sonner";
import { getOrderColumns } from "./column";
import { Order } from "@/types/order";
import { getOrders, updateOrder } from "@/src/services/orderService";
import { DataTable as DataTableNew } from "@/src/components/data-table/data-table";
import { DataTablePagination } from "@/src/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/src/hooks/use-data-table-instance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useSession } from "next-auth/react";

export function OrdersDataTable({ initialData }: { initialData: Order[] }) {
    const [data, setData] = React.useState<Order[]>(initialData);
    const { data: session } = useSession();

    const markAsDelivered = async (orderId: string) => {
        try {
            await updateOrder(orderId, { deliveryStatus: true });
            toast.success("Order marked as delivered!");
            const token = session?.user?.accessToken ?? null;
            const updatedData = await getOrders(token);
            setData(updatedData.data.orders);
        } catch (error) {
            toast.error("Failed to update order status.");
        }
    };

    const columns = React.useMemo(() => getOrderColumns(markAsDelivered), []);

    const processingOrders = data.filter(order => !order.deliveryStatus);
    const deliveredOrders = data.filter(order => order.deliveryStatus);

    const processingTable = useDataTableInstance({ data: processingOrders, columns, getRowId: (row) => row._id });
    const deliveredTable = useDataTableInstance({ data: deliveredOrders, columns, getRowId: (row) => row._id });

    return (
        <Tabs defaultValue="processing" className="w-full flex-col justify-start gap-6">
            <TabsList>
                <TabsTrigger value="processing">Processing ({processingOrders.length})</TabsTrigger>
                <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="processing">
                <div className="overflow-hidden rounded-lg border">
                    <DataTableNew table={processingTable} columns={columns} />
                </div>
                <DataTablePagination table={processingTable} />
            </TabsContent>
            <TabsContent value="delivered">
                <div className="overflow-hidden rounded-lg border">
                    <DataTableNew table={deliveredTable} columns={columns} />
                </div>
                <DataTablePagination table={deliveredTable} />
            </TabsContent>
        </Tabs>
    );
}