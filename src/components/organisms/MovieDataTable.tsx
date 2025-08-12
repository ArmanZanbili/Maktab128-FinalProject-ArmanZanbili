"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>(initialData.data?.products || []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (selectedMovie) {
                await updateMovie(selectedMovie._id, formData);
                toast.success("Movie updated successfully!");
            } else {
                await createMovie(formData);
                toast.success("Movie created successfully!");
            }
            setSelectedMovie(null);
            router.refresh();
        } catch (error) { toast.error("An error occurred."); }
    };

    const handleDelete = async () => {
        if (selectedMovie) {
            try {
                await deleteMovie(selectedMovie._id);
                toast.success("Movie deleted successfully!");
            } catch (error) { toast.error("Failed to delete movie."); }
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
                    <FaPlus className="mr-2 h-4 w-4" /> Add Movie
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Actions</TableHead>
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
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => openDialog(movie)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => openAlertDialog(movie)}>Delete</DropdownMenuItem>
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
                    <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>
                        This will permanently delete the movie.
                    </AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedMovie(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}