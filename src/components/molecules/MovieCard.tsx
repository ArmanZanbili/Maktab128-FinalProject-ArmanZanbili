'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Movie } from '@/types/movie';
import { FaCartPlus, FaCartShopping } from 'react-icons/fa6';
import { cn } from '@/src/lib/utils';

export function MovieCard({ movie }: { movie: Movie }) {
    const t = useTranslations('HomePage');
    const [isAdded, setIsAdded] = useState(false);

    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    const imageUrl = movie.thumbnail.startsWith('http')
        ? movie.thumbnail
        : `${backendBaseUrl}/images/products/thumbnails/${movie.thumbnail}`;

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(movie.price);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();

        if (isAdded) {
            toast.info(t('removedFromCart'));
            setIsAdded(false);
        } else {
            toast.success(t('addedToCart'));
            setIsAdded(true);
        }
    };

    return (
        <Link
            href="#"
            className="group relative flex h-120 flex-col justify-end overflow-hidden rounded-lg bg-gray-900 text-white shadow-lg transition-shadow duration-300 hover:shadow-primary/20 dark:border dark:border-gray-800 dark:shadow-primary/10"
        >
            <Image
                src={imageUrl}
                alt={movie.name}
                fill
                className="absolute left-0 top-0 z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-20 flex flex-1 flex-col justify-end p-4">
                <div className="flex-grow" />
                <div>
                    <h3 className="text-lg font-bold">{movie.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-px gap-y-1 text-xs text-gray-300">
                        <span>{movie.brand}</span>
                        <span className="opacity-50">|</span>
                        <span>2h 28min</span>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm text-gray-200" dangerouslySetInnerHTML={{ __html: movie.description }} />

                    <div className="pt-2 mt-4 flex items-center justify-between">
                        <p className="text-xl font-bold">{formattedPrice}</p>
                        <button
                            onClick={handleAddToCart}
                            className={cn(
                                'relative h-10 w-10 rounded-full transition-colors duration-300',
                                isAdded ? 'bg-blue-500 text-white' : 'bg-primary text-primary-foreground'
                            )}
                            aria-label={t('buyNow')}
                        >
                            <span className="absolute inset-0 flex items-center justify-center">
                                <FaCartShopping className={cn('h-5 w-5 transition-all duration-300', isAdded ? 'opacity-0 scale-50' : 'opacity-100 scale-100')} />
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center">
                                <FaCartPlus className={cn('h-5 w-5 transition-all duration-300', isAdded ? 'opacity-100 scale-100' : 'opacity-0 scale-50')} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}