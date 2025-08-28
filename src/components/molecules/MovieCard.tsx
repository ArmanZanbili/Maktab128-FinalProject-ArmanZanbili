'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Movie, Category } from '@/types/movie';
import { FaCartPlus } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { useCartStore } from '@/src/stores/cart-store';
import { Badge } from '../ui/badge';
import { cn } from '@/src/lib/utils';

export function MovieCard({ movie }: { movie: Movie }) {
    if (!movie) return null;

    const t = useTranslations('HomePage');
    const addToCart = useCartStore((state) => state.addToCart);

    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    const imageUrl = movie.thumbnail.startsWith('http') || movie.thumbnail.startsWith('blob:')
        ? movie.thumbnail
        : `${backendBaseUrl}/images/products/thumbnails/${movie.thumbnail}`;

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(movie.price);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        addToCart(movie, 1);
    };

    const renderCategoryBadge = (category: string | Category) => {
        const name = typeof category === 'string' ? category : category.name;
        const key = typeof category === 'object' && '_id' in category ? category._id : name;
        return <Badge key={key} variant="secondary">{name}</Badge>;
    };

    return (
        <Link href={`/movies/${movie._id}`} className="block group w-full">
            <div className="flex flex-col h-full bg-card rounded-lg overflow-hidden border border-border/10 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
                {/* --- Image Section --- */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={movie.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
                    <Button
                        onClick={handleAddToCart}
                        size="icon"
                        className="absolute bottom-3 right-3 h-10 w-10 shrink-0 rounded-full bg-primary/80 backdrop-blur-sm text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary"
                        aria-label={t('buyNow')}
                    >
                        <FaCartPlus className="h-5 w-5" />
                    </Button>
                </div>

                {/* --- Content Section --- */}
                <div className="flex flex-col flex-grow p-4">
                    <div className="flex flex-wrap items-center gap-1 mb-2">
                        {movie.categories.slice(0, 2).map(renderCategoryBadge)}
                    </div>
                    <h3 className="font-semibold text-lg truncate flex-grow" title={movie.name}>
                        {movie.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xl font-bold text-primary">{formattedPrice}</p>
                        <p className="text-xs text-muted-foreground">{movie.brand}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}