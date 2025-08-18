"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import axios from "axios";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useDataTableInstance } from "@/src/hooks/use-data-table-instance";
import { DataTable as DataTableNew } from "@/src/components/data-table/data-table";
import { DataTablePagination } from "@/src/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/src/components/data-table/data-table-view-options";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { createMovie, updateMovie, deleteMovie, getMovies } from "@/src/services/movieService";
import { MovieDialog } from "./dialog";
import { LocalImageUploaderDialog } from "./image-picker-dialog";
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
  const [pageCount, setPageCount] = React.useState<number>(initialData?.total_pages || 1);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null);
  const [refetchTrigger, setRefetchTrigger] = React.useState(0);
  const initialRender = React.useRef(true);

  const [isImagePickerOpen, setIsImagePickerOpen] = React.useState(false);
  const [movieForImageChange, setMovieForImageChange] = React.useState<Movie | null>(null);
  const [thumbnailOverrides, setThumbnailOverrides] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    return () => {
      Object.values(thumbnailOverrides).forEach(url => URL.revokeObjectURL(url));
    };
  }, [thumbnailOverrides]);

  React.useEffect(() => {
    setData(initialData?.data?.products || []);
    setPageCount(initialData?.total_pages || 1);
  }, [initialData]);

  const openDialog = (movie: Movie | null = null) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };
  const openAlertDialog = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsAlertOpen(true);
  };

  const openImagePicker = (movie: Movie) => {
    setMovieForImageChange(movie);
    setIsImagePickerOpen(true);
  };

  const columns = React.useMemo(() => getMovieColumns({ openDialog, openAlertDialog, openImagePicker }), []);

  const displayedData = React.useMemo(() => {
    return data.map(movie => ({
      ...movie,
      thumbnail: thumbnailOverrides[movie._id] || movie.thumbnail,
    }));
  }, [data, thumbnailOverrides]);

  const table = useDataTableInstance({
    data: displayedData,
    columns,
    getRowId: (row) => row._id,
    pageCount,
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  React.useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const fetchNewData = async () => {
      try {
        const newData = await getMovies(null, { page: pageIndex + 1, limit: pageSize });
        setData(newData.data.products);
        setPageCount(newData.total_pages);
      } catch (error) {
        toast.error("Failed to fetch movies.");
      }
    };
    fetchNewData();
  }, [pageIndex, pageSize, refetchTrigger]);

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
      setRefetchTrigger(prev => prev + 1);
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
      setRefetchTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(tCommon("errorDelete"));
    } finally {
      setIsAlertOpen(false);
      setSelectedMovie(null);
    }
  };

  const handleThumbnailOverride = (movieId: string, file: File) => {
    setThumbnailOverrides(prev => {
      const oldUrl = prev[movieId];
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }
      const newUrl = URL.createObjectURL(file);
      return {
        ...prev,
        [movieId]: newUrl,
      };
    });
    toast.success("Preview image updated for this session.");
    setIsImagePickerOpen(false);
  };

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

      <LocalImageUploaderDialog
        isOpen={isImagePickerOpen}
        onOpenChange={setIsImagePickerOpen}
        movie={movieForImageChange}
        onImageSelect={handleThumbnailOverride}
      />

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
    </>
  );
}