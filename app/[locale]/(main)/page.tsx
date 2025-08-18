import { Hero } from '@/src/components/organisms/Hero';
import { MovieGrid } from '@/src/components/organisms/MovieGrid';
import { getMovies } from '@/src/services/movieService';
import { Movie } from '@/types/movie';

export default async function HomePage() {
  const moviesResponse = await getMovies(null, { limit: 12 });
  const movies: Movie[] = moviesResponse?.data?.products || [];

  return (
    <>
      <Hero />
      <MovieGrid movies={movies} />
    </>
  );
}