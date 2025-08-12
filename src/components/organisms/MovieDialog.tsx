import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog";
import { MovieForm } from "./MovieForm";
import { Movie } from "@/types/movie";

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
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{movie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to {movie ? 'update the' : 'add a new'} movie.
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