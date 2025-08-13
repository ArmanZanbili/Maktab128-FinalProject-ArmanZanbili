"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "../ui/button";
import { FaPlus, FaPencil, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { createSubcategory, updateSubcategory, deleteSubcategory } from "@/src/services/subcategoryService";
import { SubcategoryDialog } from "./SubcategoryDialog";
import { Subcategory } from "@/types/movie";
import { SubcategoryFormValues } from "@/src/validations/subcategory-validation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";

export function SubcategoriesDataTable({ initialData }: { initialData: any }) {
    const t = useTranslations('Admin.subcategories');
    const tCommon = useTranslations('Admin.common');
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

    const subcategories: Subcategory[] = initialData.data?.subcategories || [];

    const handleFormSubmit = async (data: SubcategoryFormValues) => {
        try {
            if (selectedSubcategory) {
                await updateSubcategory(selectedSubcategory._id, data);
                toast.success(tCommon('successUpdate'));
            } else {
                await createSubcategory(data);
                toast.success(tCommon('successCreate'));
            }
            setSelectedSubcategory(null);
            router.refresh();
        } catch (error) { toast.error(tCommon('error')); }
    };

    const handleDelete = async () => {
        if (selectedSubcategory) {
            try {
                await deleteSubcategory(selectedSubcategory._id);
                toast.success(tCommon('successDelete'));
            } catch (error) { toast.error(tCommon('errorDelete')); }
            finally {
                setIsAlertOpen(false);
                setSelectedSubcategory(null);
                router.refresh();
            }
        }
    };

    const openDialog = (subcategory: Subcategory | null = null) => {
        setSelectedSubcategory(subcategory);
        setIsDialogOpen(true);
    };

    const openAlertDialog = (subcategory: Subcategory) => {
        setSelectedSubcategory(subcategory);
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
                            <TableHead><span className="flex items-center justify-start ml-5 rtl:mr-5">{tCommon('name')}</span></TableHead>
                            <TableHead><span className="flex items-center justify-end mr-5 rtl:ml-5">{tCommon('actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subcategories.map((subcategory) => (
                            <TableRow key={subcategory._id}>
                                <TableCell><span className="flex items-center justify-start ml-5 rtl:mr-5">{subcategory.name}</span></TableCell>
                                <TableCell className="flex items-center justify-end">
                                    <div className="flex items-center justify-end rtl:justify-start">
                                        <Button variant="ghost" size="icon" onClick={() => openDialog(subcategory)} className="text-blue-500 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50">
                                            <FaPencil className="h-4 w-4" />
                                            <span className="sr-only">{tCommon('edit')}</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => openAlertDialog(subcategory)} className="text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50">
                                            <FaTrash className="h-4 w-4" />
                                            <span className="sr-only">{tCommon('delete')}</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isDialogOpen && (
                <SubcategoryDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} subcategory={selectedSubcategory} onSubmit={handleFormSubmit} />
            )}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteDescription')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedSubcategory(null)}>{tCommon('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>{tCommon('continue')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}