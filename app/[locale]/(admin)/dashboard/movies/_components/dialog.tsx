"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { MovieForm } from "./form";
import { Movie, Category, Subcategory } from "@/types/movie";

export function MovieDialog({
    isOpen,
    setIsOpen,
    movie,
    onSubmit,
    categories,
    subcategories
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    movie?: Movie | null;
    onSubmit: (data: FormData) => void;
    categories: Category[];
    subcategories: Subcategory[];
}) {
    const t = useTranslations("Admin.movies.dialog");

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{movie ? t("editTitle") : t("addTitle")}</DialogTitle>
                    <DialogDescription>
                        {movie ? t("editDescription") : t("addDescription")}
                    </DialogDescription>
                </DialogHeader>
                <MovieForm
                    movie={movie}
                    onSubmit={onSubmit}
                    onFinished={() => setIsOpen(false)}
                    categories={categories}
                    subcategories={subcategories}
                />
            </DialogContent>
        </Dialog>
    );
}