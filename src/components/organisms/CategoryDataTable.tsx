"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { FaPlus, FaPencil, FaTrash, FaShapes } from "react-icons/fa6";
import { toast } from "react-toastify";
import { createCategory, updateCategory, deleteCategory } from "@/src/services/categoryService";
import { CategoryDialog } from "./CategoryDialog";
import { Category } from "@/types/movie";

import { useTranslations } from "next-intl";

export function CategoriesDataTable({ initialData }: { initialData: any }) {
    const t = useTranslations('Admin.categories');
    const tCommon = useTranslations('Admin.common');
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const categories: Category[] = initialData.data?.categories || [];

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory._id, formData);
                toast.success(tCommon('successUpdate'));
            } else {
                await createCategory(formData);
                toast.success(tCommon('successCreate'));
            }
            setSelectedCategory(null);
            router.refresh();
        } catch (error) { toast.error(tCommon('error')); }
    };

    const handleDelete = async () => {
        if (selectedCategory) {
            try {
                await deleteCategory(selectedCategory._id);
                toast.success("Category deleted successfully!");
            } catch (error) { toast.error("Failed to delete category."); }
            finally {
                setIsAlertOpen(false);
                setSelectedCategory(null);
                router.refresh();
            }
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
                            <TableHead><span className="flex items-center justify-start ml-5 rtl:mr-5">{tCommon('icon')}</span></TableHead>
                            <TableHead><span className="flex items-center justify-start ml-5 rtl:mr-5">{tCommon('name')}</span></TableHead>
                            <TableHead><span className="flex items-center justify-end mr-5 rtl:ml-5">{tCommon('actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>
                                    <span className="flex items-center justify-start ml-5 rtl:mr-5">
                                        {category.icon && category.icon !== 'categories-icons-default.png' ? (
                                            <Image
                                                alt={category.name} className="aspect-square rounded-md object-cover" height="40"
                                                src={`/images/categories/icons/${category.icon}`}
                                                width="40"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                                                <FaShapes className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="flex items-center justify-start ml-5 rtl:mr-5">
                                        {category.name}</span>
                                </TableCell>
                                <TableCell className="flex items-center justify-end">
                                    <div className="flex items-center justify-end rtl:justify-start">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openDialog(category)}
                                            className="text-blue-500 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50"
                                        >
                                            <FaPencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openAlertDialog(category)}
                                            className="text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isDialogOpen && (
                <CategoryDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} category={selectedCategory} onSubmit={handleFormSubmit} />
            )}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('deleteTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedCategory(null)}>{tCommon('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>{tCommon('continue')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}