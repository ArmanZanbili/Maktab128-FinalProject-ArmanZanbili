"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Movie } from "@/types/movie";
import { MovieCard } from "../molecules/MovieCard";

interface MovieCarouselProps {
    title: string;
    movies: Movie[];
}

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl border-l-4 border-primary pl-4">
                    {title}
                </h2>
            </div>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {movies.map((movie) => (
                        <CarouselItem key={movie._id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                            <MovieCard movie={movie} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex left-4" />
                <CarouselNext className="hidden sm:flex right-4" />
            </Carousel>
        </section>
    );
}