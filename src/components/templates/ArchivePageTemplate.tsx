import { Movie } from "@/types/movie";
import { MovieGrid } from "@/src/components/organisms/MovieGrid";

interface ArchivePageTemplateProps {
    title: string;
    movies: Movie[];
}

export function ArchivePageTemplate({ title, movies }: ArchivePageTemplateProps) {
    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-8">
            <h1 className="mb-8 text-4xl font-extrabold tracking-tight border-l-4 border-primary pl-4">
                {title}
            </h1>
            {movies.length > 0 ? (
                <MovieGrid movies={movies} />
            ) : (
                <div className="text-center text-muted-foreground">
                    <p>No movies found in this section.</p>
                </div>
            )}
        </div>
    );
}