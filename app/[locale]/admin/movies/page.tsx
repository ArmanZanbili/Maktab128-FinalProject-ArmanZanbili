import { getMovies } from "@/src/services/movieService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { MoviesDataTable } from "@/src/components/organisms/MovieDataTable";
import { getTranslations } from "next-intl/server";

export default async function AdminMoviesPage() {
    const initialMoviesData = await getMovies({ limit: 10, page: 1, sort: '-createdAt' });
    const t = await getTranslations('Admin.movies');

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <MoviesDataTable initialData={initialMoviesData} />
            </CardContent>
        </Card>
    );
}