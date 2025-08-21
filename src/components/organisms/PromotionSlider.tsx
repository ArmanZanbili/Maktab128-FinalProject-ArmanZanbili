"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Button } from "../ui/button";
import { Movie } from "@/types/movie";

interface PromotionSliderProps {
    movies: Movie[];
}

const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, '');
};
export function PromotionSlider({ movies }: PromotionSliderProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );
    const featuredMovies = movies.slice(0, 3);
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    return (
        <section className="py-12">
            <Carousel
                plugins={[plugin.current]}
                opts={{ loop: true }}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {featuredMovies.map((movie) => {
                        const imageUrl = `${backendBaseUrl}/images/products/thumbnails/${movie.thumbnail}`;
                        const cleanDescription = stripHtml(movie.description).substring(0, 100) + '...';

                        return (
                            <CarouselItem key={movie._id}>
                                <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden rounded-lg">
                                    <Image
                                        src={imageUrl}
                                        alt={movie.name}
                                        fill
                                        className="object-cover animate-kenburns"
                                    />
                                    <div className="absolute inset-0 bg-black/60" />
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
                                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{movie.name}</h2>
                                        <p className="mt-4 max-w-2xl text-lg text-gray-200">{cleanDescription}</p>
                                        <Button asChild size="lg" className="mt-8">
                                            <Link href={`/movies/${movie._id}`}>View Movie</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </section>
    );
}