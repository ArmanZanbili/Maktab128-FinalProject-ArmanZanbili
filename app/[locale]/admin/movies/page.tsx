import { getMovies } from "@/src/services/movieService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { MoviesDataTable } from "@/src/components/organisms/MovieDataTable";

export default async function AdminMoviesPage() {
    const initialMoviesData = await getMovies({ limit: 10, page: 1, sort: '-createdAt' });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Movies</CardTitle>
                <CardDescription>
                    Manage your movies, categories, and subcategories.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MoviesDataTable initialData={initialMoviesData} />
            </CardContent>
        </Card>
    );
}