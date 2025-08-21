import { getTranslations } from 'next-intl/server';
import { MovieCard } from '../molecules/MovieCard';
import { Movie } from '@/types/movie';

export async function MovieGrid({ movies }: { movies: Movie[] }) {
    const t = await getTranslations('HomePage');
    return (
        <section className="py-12 md:py-16 lg:py-20">
            <div className="mx-auto">
                <div className="grid grid-cols-1 gap-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie._id}
                            movie={movie}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}