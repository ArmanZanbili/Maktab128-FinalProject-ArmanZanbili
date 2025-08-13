import { getCategories } from "@/src/services/categoryService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { CategoriesDataTable } from "@/src/components/organisms/CategoryDataTable";
import { getTranslations } from "next-intl/server";

export default async function AdminCategoriesPage() {
    const initialData = await getCategories({ limit: 10, page: 1 });
    const t = await getTranslations('Admin.categories');

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <CategoriesDataTable initialData={initialData} />
            </CardContent>
        </Card>
    );
}