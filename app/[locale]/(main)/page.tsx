import { getMovies } from '@/src/services/movieService';
import { Movie } from '@/types/movie';
import { HomePageTemplate } from '@/src/components/templates/HomePageTemplate';

export default async function HomePage() {
  const moviesResponse = await getMovies(null, { limit: 12 });
  const movies: Movie[] = moviesResponse?.data?.products || [];

  return <HomePageTemplate movies={movies} />;
}