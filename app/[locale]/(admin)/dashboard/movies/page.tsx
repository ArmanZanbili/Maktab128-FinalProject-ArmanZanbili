import { getMovies } from "@/src/services/movieService";
import { getCategories } from "@/src/services/categoryService";
import { getSubcategories } from "@/src/services/subcategoryService";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { MoviesDataTable } from "./_components/data-table";
import { getTranslations } from "next-intl/server";
import { auth } from "@/src/lib/auth";

export default async function AdminMoviesPage() {
    const session = await auth();
    const t = await getTranslations("Admin.movies");

    const token = session?.user.accessToken ?? null;

    const [moviesData, categoriesData, subcategoriesData] = await Promise.all([
        getMovies(token, { limit: 10, page: 1 }),
        getCategories(token, { limit: 1000 }),
        getSubcategories(token, { limit: 1000 })
    ]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <MoviesDataTable
                    initialData={moviesData}
                    allCategories={categoriesData?.data?.categories || []}
                    allSubcategories={subcategoriesData?.data?.subcategories || []}
                />
            </CardContent>
        </Card>
    );
}