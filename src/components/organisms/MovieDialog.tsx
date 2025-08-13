import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog";
import { MovieForm } from "./MovieForm";
import { Movie } from "@/types/movie";
import { useTranslations } from "next-intl";

export function MovieDialog({
    isOpen,
    setIsOpen,
    movie,
    onSubmit,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    movie?: Movie | null;
    onSubmit: (data: FormData) => void;
}) {
    const t = useTranslations('Admin.movies.dialog');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{movie ? t('editTitle') : t('addTitle')}</DialogTitle>
                    <DialogDescription>
                        {movie ? t('editDescription') : t('addDescription')}
                    </DialogDescription>
                </DialogHeader>
                <MovieForm
                    movie={movie}
                    onSubmit={onSubmit}
                    onFinished={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}