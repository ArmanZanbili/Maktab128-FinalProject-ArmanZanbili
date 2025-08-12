import { getTranslations } from 'next-intl/server';
import { MovieCard } from '../molecules/MovieCard';

export async function MovieGrid() {
    const t = await getTranslations('HomePage');

    const movieKeys = Object.keys(t.raw('movies'));

    const shuffledKeys = movieKeys.sort(() => 0.5 - Math.random());

    return (
        <section className="py-12 md:py-16 lg:py-20">
            <div className="mx-auto">
                <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl">{t('featuredFilms')}</h2>
                <div className="grid grid-cols-1 gap-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                    {shuffledKeys.map((key) => (
                        <MovieCard
                            key={key}
                            title={t(`movies.${key}.title`)}
                            price={t(`movies.${key}.price`)}
                            ageRating={t(`movies.${key}.ageRating`)}
                            duration={t(`movies.${key}.duration`)}
                            genres={t(`movies.${key}.genres`)}
                            year={t(`movies.${key}.year`)}
                            summary={t(`movies.${key}.summary`)}
                            rating={t(`movies.${key}.rating`)}
                            ratingLabel={t(`movies.${key}.ratingLabel`)}
                            imageUrl={t(`movies.${key}.imageUrl`)}
                            priority={true}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}