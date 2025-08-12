import { getSubcategories } from "@/src/services/subcategoryService";
import { SubcategoriesDataTable } from "@/src/components/organisms/SubcategoryDataTable";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/src/components/ui/card";

export default async function AdminSubcategoriesPage() {
    const initialData = await getSubcategories({ limit: 10, page: 1 });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subcategories</CardTitle>
                <CardDescription>
                    Manage your movie subcategories here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SubcategoriesDataTable initialData={initialData} />
            </CardContent>
        </Card>
    );
}