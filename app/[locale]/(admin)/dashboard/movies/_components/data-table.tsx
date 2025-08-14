"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import axios from "axios";
import { Plus } from "lucide-react";
import Image from "next/image"; 

import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { useDataTableInstance } from "@/src/hooks/use-data-table-instance";
import { DataTable as DataTableNew } from "@/src/components/data-table/data-table";
import { DataTablePagination } from "@/src/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/src/components/data-table/data-table-view-options";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";

import { createMovie, updateMovie, deleteMovie } from "@/src/services/movieService";
import { MovieDialog } from "./dialog";
import { Movie, Category, Subcategory } from "@/types/movie";
import { getMovieColumns } from "./columns";

export function MoviesDataTable({
  initialData,
  allCategories,
  allSubcategories
}: {
  initialData: any;
  allCategories: Category[];
  allSubcategories: Subcategory[];
}) {
  const t = useTranslations("Admin.movies");
  const tCommon = useTranslations("Admin.common");
  const router = useRouter();

  const [data, setData] = React.useState<Movie[]>(() => initialData?.data?.products || []);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null); 

  React.useEffect(() => {
    setData(initialData?.data?.products || []);
  }, [initialData]);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (selectedMovie) {
        await updateMovie(selectedMovie._id, formData);
        toast.success(tCommon("successUpdate"));
      } else {
        await createMovie(formData);
        toast.success(tCommon("successCreate"));
      }
      setIsDialogOpen(false);
      setSelectedMovie(null);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("A movie with this name already exists.");
      } else {
        console.error("Failed to save movie:", error);
        toast.error(tCommon("error"));
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedMovie) return;
    try {
      await deleteMovie(selectedMovie._id);
      toast.success(tCommon("successDelete"));
      router.refresh();
    } catch (error) {
      toast.error(tCommon("errorDelete"));
    } finally {
      setIsAlertOpen(false);
      setSelectedMovie(null);
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
  
  const openImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
  };

  const columns = React.useMemo(() => getMovieColumns({ openDialog, openAlertDialog, openImagePreview }), []);
  const table = useDataTableInstance({ data, columns, getRowId: (row) => row._id });

  return (
    <>
      <Tabs defaultValue="all-movies" className="w-full flex-col justify-start gap-6">
        <div className="flex items-center justify-between">
            <TabsList>
            <TabsTrigger value="all-movies">{t("title")}</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
            <Button variant="outline" size="sm" onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">{t("add")}</span>
            </Button>
            </div>
        </div>
        <TabsContent value="all-movies" className="relative flex flex-col gap-4 overflow-auto">
            <div className="overflow-hidden rounded-lg border">
            <DataTableNew table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
        </TabsContent>
      </Tabs>

      {isDialogOpen && (
        <MovieDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          movie={selectedMovie}
          onSubmit={handleFormSubmit}
          categories={allCategories}
          subcategories={allSubcategories}
        />
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedMovie(null)}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {tCommon("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!previewImageUrl} onOpenChange={(isOpen) => !isOpen && setPreviewImageUrl(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImageUrl && (
            <div className="relative mt-4 h-96 w-full">
              <Image
                src={previewImageUrl}
                alt="Movie Thumbnail Preview"
                layout="fill"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}