"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { FaPlus, FaEllipsis } from "react-icons/fa6";
import { toast } from "react-toastify";
import { createMovie, updateMovie, deleteMovie } from "@/src/services/movieService";
import { MovieDialog } from "./MovieDialog";
import { Movie } from "@/types/movie";

export function MoviesDataTable({ initialData }: { initialData: any }) {
    const t = useTranslations('Admin.movies');
    const tCommon = useTranslations('Admin.common');
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>(initialData.data?.products || []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (selectedMovie) {
                await updateMovie(selectedMovie._id, formData);
                toast.success(tCommon('successUpdate'));
            } else {
                await createMovie(formData);
                toast.success(tCommon('successCreate'));
            }
            setSelectedMovie(null);
            router.refresh();
        } catch (error) { toast.error(tCommon('error')); }
    };

    const handleDelete = async () => {
        if (selectedMovie) {
            try {
                await deleteMovie(selectedMovie._id);
                toast.success(tCommon('successDelete'));
            } catch (error) { toast.error(tCommon('errorDelete')); }
            finally {
                setIsAlertOpen(false);
                setSelectedMovie(null);
                router.refresh();
            }
        }
    };

    const openDialog = (movie: Movie | null = null) => {
        setSelectedMovie(movie);
        setIsDialogOpen(true);
    };

    const openAlertDialog = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsAlertOpen(true);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => openDialog()}>
                    <FaPlus className="mr-2 h-4 w-4" /> {t('add')}
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">{tCommon('image')}</TableHead>
                            <TableHead>{tCommon('name')}</TableHead>
                            <TableHead>{tCommon('price')}</TableHead>
                            <TableHead>{tCommon('quantity')}</TableHead>
                            <TableHead>{tCommon('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movies.map((movie) => (
                            <TableRow key={movie._id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt={movie.name} className="aspect-square rounded-md object-cover" height="64"
                                        src={movie.thumbnail.startsWith('http') ? movie.thumbnail : `/images/products/thumbnails/${movie.thumbnail}`}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{movie.name}</TableCell>
                                <TableCell>${movie.price}</TableCell>
                                <TableCell>{movie.quantity}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <FaEllipsis className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{tCommon('actions')}</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => openDialog(movie)}>{tCommon('edit')}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => openAlertDialog(movie)}>{tCommon('delete')}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isDialogOpen && (
                <MovieDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} movie={selectedMovie} onSubmit={handleFormSubmit} />
            )}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteDescription')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedMovie(null)}>{tCommon('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>{tCommon('continue')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}