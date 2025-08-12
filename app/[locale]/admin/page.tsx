export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-4 text-card-foreground">
                    <h2 className="font-semibold">Daily Sales</h2>
                    <p className="text-3xl font-bold">--</p>
                    <p className="text-xs text-muted-foreground">Chart coming soon</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-card-foreground">
                    <h2 className="font-semibold">Daily Orders</h2>
                    <p className="text-3xl font-bold">--</p>
                    <p className="text-xs text-muted-foreground">Chart coming soon</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-card-foreground">
                    <h2 className="font-semibold">Products by Group</h2>
                    <p className="text-3xl font-bold">--</p>
                    <p className="text-xs text-muted-foreground">Chart coming soon</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-card-foreground">
                    <h2 className="font-semibold">Out of Stock %</h2>
                    <p className="text-3xl font-bold">--%</p>
                    <p className="text-xs text-muted-foreground">Gauge coming soon</p>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-4 text-card-foreground">
                <h2 className="font-semibold">Recent Orders</h2>
                <p className="text-muted-foreground">Order list coming soon...</p>
            </div>
        </div>
    );
}