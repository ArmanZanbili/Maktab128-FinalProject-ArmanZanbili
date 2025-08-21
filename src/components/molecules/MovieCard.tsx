'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Movie } from '@/types/movie';
import { FaCartPlus } from 'react-icons/fa6';
import { Button } from '../ui/button';

export function MovieCard({ movie }: { movie: Movie }) {
    if (!movie) return null;
    const t = useTranslations('HomePage');
    const [isAdded, setIsAdded] = useState(false);

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
        toast.success(t('addedToCart'));
        setIsAdded(true);
    };

    return (
        <div className="group relative w-full">
            <Link href={`/movies/${movie._id}`} className="block space-y-3">
                <div className="overflow-hidden rounded-md">
                    <Image
                        src={imageUrl}
                        alt={movie.name}
                        width={400}
                        height={600}
                        className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="flex flex-col">
                    <h3 className="font-semibold text-base truncate">{movie.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-bold text-primary">{formattedPrice}</p>
                        <Button
                            onClick={handleAddToCart}
                            size="icon"
                            className="h-9 w-9 shrink-0"
                            aria-label={t('buyNow')}
                            disabled={isAdded}
                        >
                            <FaCartPlus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}