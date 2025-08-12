"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

    const subcategories: Subcategory[] = initialData.data?.subcategories || [];

    const handleFormSubmit = async (data: SubcategoryFormValues) => {
        try {
            if (selectedSubcategory) {
                await updateSubcategory(selectedSubcategory._id, data);
                toast.success("Subcategory updated successfully!");
            } else {
                await createSubcategory(data);
                toast.success("Subcategory created successfully!");
            }
            setSelectedSubcategory(null);
            router.refresh();
        } catch (error) { toast.error("An error occurred."); }
    };

    const handleDelete = async () => {
        if (selectedSubcategory) {
            try {
                await deleteSubcategory(selectedSubcategory._id);
                toast.success("Subcategory deleted successfully!");
            } catch (error) { toast.error("Failed to delete subcategory."); }
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
                    <FaPlus className="mr-2 h-4 w-4" /> Add Subcategory
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <span className="flex items-center justify-start ml-5 rtl:mr-5">
                                    Name
                                </span>
                            </TableHead>
                            <TableHead>
                                <span className="flex items-center justify-end mr-5 rtl:ml-5">
                                    Actions
                                </span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subcategories.map((subcategory) => (
                            <TableRow key={subcategory._id}>
                                <TableCell>
                                    <span className="flex items-center justify-start ml-5 rtl:mr-5">
                                        {subcategory.name}</span>
                                </TableCell>
                                <TableCell className="flex items-center justify-end">
                                    <div className="flex items-center justify-end rtl:justify-start">
                                        <Button variant="ghost" size="icon" onClick={() => openDialog(subcategory)} className="text-blue-500 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50">
                                            <FaPencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => openAlertDialog(subcategory)} className="text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50">
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
                <SubcategoryDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} subcategory={selectedSubcategory} onSubmit={handleFormSubmit} />
            )}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>
                        This will permanently delete the subcategory.
                    </AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedSubcategory(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}