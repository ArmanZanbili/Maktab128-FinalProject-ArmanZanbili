import { getCategories } from "@/src/services/categoryService";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/src/components/ui/card";
import { CategoriesDataTable } from "@/src/components/organisms/CategoryDataTable";

export default async function AdminCategoriesPage() {
    const initialData = await getCategories({ limit: 10, page: 1 });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                    Manage your movie categories here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CategoriesDataTable initialData={initialData} />
            </CardContent>
        </Card>
    );
}