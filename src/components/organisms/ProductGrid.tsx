import { getTranslations } from 'next-intl/server';
import { ProductCard } from '../molecules/ProductCard';

const placeholderProductKeys = [
    { id: 1, key: 'watch', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=500' },
    { id: 2, key: 'headphones', imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=500' },
    { id: 3, key: 'lamp', imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=500' },
    { id: 4, key: 'candle', imageUrl: 'https://images.unsplash.com/photo-1596433809551-063766b74e30?w=500' },
];

export async function ProductGrid() {
    const t = await getTranslations('HomePage');

    return (
        <section className="py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl">{t('featuredTitle')}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {placeholderProductKeys.map((product) => (
                        <ProductCard
                            key={product.id}
                            name={t(`products.${product.key}.name`)}
                            price={t(`products.${product.key}.price`)}
                            imageUrl={product.imageUrl}
                            buttonText={t('addToCart')}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}