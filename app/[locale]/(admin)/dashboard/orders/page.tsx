import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { getOrders } from "@/src/services/orderService";
import { OrdersDataTable } from "./_components/data-table";
import { auth } from "@/src/lib/auth";


export default async function AdminOrdersPage() {

    const session = await auth();
    const token = session?.user?.accessToken ?? null;

    const initialData = await getOrders(token);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage all customer orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <OrdersDataTable initialData={initialData?.data?.orders || []} />
            </CardContent>
        </Card>
    );
}