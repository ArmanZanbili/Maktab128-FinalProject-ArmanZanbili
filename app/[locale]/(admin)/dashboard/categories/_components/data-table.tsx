"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useDataTableInstance } from "@/src/hooks/use-data-table-instance";
import { DataTable as DataTableNew } from "@/src/components/data-table/data-table";
import { DataTablePagination } from "@/src/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/src/components/data-table/data-table-view-options";

import { createCategory, updateCategory, deleteCategory } from "@/src/services/categoryService";
import { CategoryDialog } from "./dialog";
import { Category } from "@/types/movie";
import { getCategoryColumns } from "./columns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import axios from "axios";

export function CategoriesDataTable({ initialData }: { initialData: any }) {
    const t = useTranslations("Admin.categories");
    const tCommon = useTranslations("Admin.common");
    const router = useRouter();

    const [data, setData] = React.useState<Category[]>(() => initialData?.data?.categories || []);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

    React.useEffect(() => {
        setData(initialData?.data?.categories || []);
    }, [initialData]);

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory._id, formData);
                toast.success(tCommon("successUpdate"));
            } else {
                await createCategory(formData);
                toast.success(tCommon("successCreate"));
            }
            setIsDialogOpen(false);
            setSelectedCategory(null);
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("A category with this name already exists.");
            } else {
                console.error("Failed to save category:", error);
                toast.error(tCommon("error"));
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        try {
            await deleteCategory(selectedCategory._id);
            toast.success(tCommon("successDelete"));
            router.refresh();
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error(tCommon("errorDelete"));
        } finally {
            setIsAlertOpen(false);
            setSelectedCategory(null);
        }
    };

    const openDialog = (category: Category | null = null) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

    const openAlertDialog = (category: Category) => {
        setSelectedCategory(category);
        setIsAlertOpen(true);
    };

    const columns = React.useMemo(() => getCategoryColumns({ openDialog, openAlertDialog }), []);
    const table = useDataTableInstance({ data, columns, getRowId: (row) => row._id });

    return (
        <Tabs defaultValue="all-categories" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="all-categories">{t("title")}</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <Button variant="outline" size="sm" onClick={() => openDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden lg:inline">{t("add")}</span>
                    </Button>
                </div>
            </div>
            <TabsContent value="all-categories" className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden rounded-lg border">
                    <DataTableNew table={table} columns={columns} />
                </div>
                <DataTablePagination table={table} />
            </TabsContent>

            {isDialogOpen && (
                <CategoryDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    category={selectedCategory}
                    onSubmit={handleFormSubmit}
                />
            )}

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedCategory(null)}>
                            {tCommon("cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            {tCommon("continue")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Tabs>
    );
}
