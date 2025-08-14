import { getCategories } from "@/src/services/categoryService";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { getTranslations } from "next-intl/server";
import { auth } from "@/src/lib/auth";
import { CategoriesDataTable } from "./_components/data-table";

export default async function AdminCategoriesPage() {
    const session = await auth();
    const token = session?.user.accessToken ?? null;
    const initialData = await getCategories(token, { limit: 10, page: 1 });
    const t = await getTranslations("Admin.categories");

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <CategoriesDataTable initialData={initialData} />
            </CardContent>
        </Card>
    );
}
