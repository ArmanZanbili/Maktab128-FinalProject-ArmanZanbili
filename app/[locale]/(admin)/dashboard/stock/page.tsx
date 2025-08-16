import { getMovies } from "@/src/services/movieService";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { getTranslations } from "next-intl/server";
import { auth } from "@/src/lib/auth";
import { StockDataTable } from "./_components/data-table";

export default async function AdminStockPage() {
    const session = await auth();
    const t = await getTranslations("Admin.stock");

    const token = session?.user.accessToken ?? null;

    const initialData = await getMovies(token, { limit: 10, page: 1 });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <StockDataTable initialData={initialData} />
            </CardContent>
        </Card>
    );
}