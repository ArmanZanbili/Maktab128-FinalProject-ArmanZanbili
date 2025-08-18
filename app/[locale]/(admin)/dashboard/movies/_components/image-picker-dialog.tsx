// ./app/[locale]/(admin)/dashboard/movies/_components/local-image-uploader.tsx

"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Movie } from "@/types/movie";

interface LocalImageUploaderProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    movie: Movie | null;
    onImageSelect: (movieId: string, file: File) => void;
}

export function LocalImageUploaderDialog({ isOpen, onOpenChange, movie, onImageSelect }: LocalImageUploaderProps) {
    if (!movie) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(movie._id, file);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload a New Preview Image</DialogTitle>
                    <DialogDescription>
                        Choose an image from your computer to use as the temporary thumbnail for "{movie.name}".
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                    <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}