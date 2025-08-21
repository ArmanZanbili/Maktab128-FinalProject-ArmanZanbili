import { getMovieById } from '@/src/services/movieService';
import { MovieDetailTemplate } from '@/src/components/templates/MovieDetailTemplate'; // 1. Update the import path
import { notFound } from 'next/navigation';
import { auth } from '@/src/lib/auth';

type Props = {
    params: {
        movieId: string;
    };
};

export default async function MovieDetailPage({ params }: Props) {
    const session = await auth();
    const token = session?.user.accessToken ?? null;

    try {
        const movieData = await getMovieById(params.movieId, token);
        if (!movieData || !movieData.data || !movieData.data.product) {
            notFound();
        }
        return <MovieDetailTemplate movie={movieData.data.product} />;
    } catch (error) {
        console.error("Failed to fetch movie:", error);
        notFound();
    }
}