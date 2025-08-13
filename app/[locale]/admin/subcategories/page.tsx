import { getSubcategories } from "@/src/services/subcategoryService";
import { SubcategoriesDataTable } from "@/src/components/organisms/SubcategoryDataTable";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/src/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function AdminSubcategoriesPage() {
    const initialData = await getSubcategories({ limit: 10, page: 1 });
    const t = await getTranslations('Admin.subcategories');

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <SubcategoriesDataTable initialData={initialData} />
            </CardContent>
        </Card>
    );
}