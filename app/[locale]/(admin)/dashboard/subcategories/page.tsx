import { getSubcategories } from "@/src/services/subcategoryService";
import { getCategories } from "@/src/services/categoryService";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { SubcategoriesDataTable } from "./_components/data-table";
import { getTranslations } from "next-intl/server";
import { auth } from "@/src/lib/auth";

export default async function AdminSubcategoriesPage() {
    const session = await auth();
    const t = await getTranslations("Admin.subcategories");

    const token = session?.user.accessToken ?? null;

    const [subcategoriesData, categoriesData] = await Promise.all([
        getSubcategories(token, { limit: 10, page: 1 }),
        getCategories(token, { limit: 1000 })
    ]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <SubcategoriesDataTable
                    initialSubcategories={subcategoriesData}
                    allCategories={categoriesData?.data?.categories || []}
                />
            </CardContent>
        </Card>
    );
}