'use client';

import { Hero } from '@/src/components/organisms/Hero';
import { MovieCarousel } from '@/src/components/organisms/MovieCarousel';
import { PromotionSlider } from '@/src/components/organisms/PromotionSlider';
import { useSidebar } from '@/src/components/ui/sidebar';
import { cn } from '@/src/lib/utils';
import { Movie } from '@/types/movie';
import { useTranslations } from 'next-intl';

interface HomePageTemplateProps {
    movies: Movie[];
}

export function HomePageTemplate({ movies }: HomePageTemplateProps) {
    const t = useTranslations('HomePage');
    const { state: sidebarState } = useSidebar();

    const featuredMovies = movies.slice(0, 6);
    const trendingMovies = movies.slice(6, 12);

    return (
        <div
            className={cn(
                'mx-auto w-full px-4 md:px-6 transition-[max-width] duration-300 ease-in-out',
                sidebarState === 'expanded'
                    ? 'max-w-6xl'
                    : 'max-w-screen-xl'
            )}
        >
            <Hero />
            <MovieCarousel title={t('featuredFilms')} movies={featuredMovies} />
            <PromotionSlider movies={movies} />
            <MovieCarousel title="Trending Now" movies={trendingMovies} />
        </div>
    );
}