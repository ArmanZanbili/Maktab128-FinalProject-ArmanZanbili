'use client';

import * as React from 'react';
import Image from 'next/image';
import { Movie, Category, Subcategory } from '@/types/movie';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { FaCartPlus, FaPlay } from 'react-icons/fa6';
import { toast } from 'sonner';

export function MovieDetailTemplate({ movie }: { movie: Movie }) {
    const [selectedImage, setSelectedImage] = React.useState(movie.thumbnail);
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '/placeholder.png';
        return imagePath.startsWith('http') || imagePath.startsWith('blob:')
            ? imagePath
            : `${backendBaseUrl}/images/products/images/${imagePath}`;
    };

    const getThumbnailUrl = (imagePath: string) => {
        if (!imagePath) return '/placeholder.png';
        return imagePath.startsWith('http') || imagePath.startsWith('blob:')
            ? imagePath
            : `${backendBaseUrl}/images/products/thumbnails/${imagePath}`;
    }

    const galleryImages = [movie.thumbnail, ...movie.images.filter(img => img !== 'products-images-default.jpeg')];

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(movie.price);

    const handleAddToCart = () => {
        toast.success(`${movie.name} added to cart!`);
    };

    const renderCategoryBadge = (category: string | Category | Subcategory) => {
        const name = typeof category === 'string' ? category : category.name;
        const key = typeof category === 'object' && '_id' in category ? category._id : name;
        return <Badge key={key} variant="secondary">{name}</Badge>;
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                <div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                        <Image
                            src={selectedImage === movie.thumbnail ? getThumbnailUrl(selectedImage) : getImageUrl(selectedImage)}
                            alt={`Main view of ${movie.name}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {galleryImages.map((image, index) => (
                            <button
                                key={index}
                                className={`relative aspect-square w-full overflow-hidden rounded-md transition-all duration-200 hover:scale-105 ${selectedImage === image ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <Image
                                    src={image === movie.thumbnail ? getThumbnailUrl(image) : getImageUrl(image)}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {movie.categories.map(renderCategoryBadge)}
                        {movie.subcategories.map(renderCategoryBadge)}
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">{movie.name}</h1>

                    <p className="text-lg text-muted-foreground mb-6">
                        Studio: <span className="font-semibold text-foreground">{movie.brand}</span>
                    </p>

                    <div className="prose prose-invert max-w-none text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: movie.description }} />

                    <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
                            <Badge variant="outline">In Stock: {movie.quantity}</Badge>
                        </div>
                        <div className="flex gap-4">
                            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                                <FaCartPlus className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button size="lg" variant="outline" className="flex-1">
                                <FaPlay className="mr-2 h-5 w-5" />
                                Watch Trailer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}