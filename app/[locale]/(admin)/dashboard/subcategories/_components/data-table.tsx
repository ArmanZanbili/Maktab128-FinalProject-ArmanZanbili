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
import { createSubcategory, updateSubcategory, deleteSubcategory, getSubcategories } from "@/src/services/subcategoryService";
import { Category, Subcategory } from "@/types/movie";
import { SubcategoryFormValues } from "@/src/validations/subcategory-validation";
import { getSubcategoryColumns } from "./columns";
import { SubcategoryDialog } from "./dialog";
import axios from "axios";


export function SubcategoriesDataTable({ initialSubcategories, allCategories }: {
    initialSubcategories: any;
    allCategories: Category[];
}) {
    const t = useTranslations("Admin.subcategories");
    const tCommon = useTranslations("Admin.common");
    const router = useRouter();

    const [data, setData] = React.useState<Subcategory[]>(() => initialSubcategories?.data?.subcategories || []);
    const [pageCount, setPageCount] = React.useState<number>(initialSubcategories?.total_pages || 1);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = React.useState<Subcategory | null>(null);
    const initialRender = React.useRef(true);
    const [refetchTrigger, setRefetchTrigger] = React.useState(0);

    React.useEffect(() => {
        setData(initialSubcategories?.data?.subcategories || []);
        setPageCount(initialSubcategories?.total_pages || 1);
    }, [initialSubcategories]);

    const categoryNameMap = React.useMemo(() => {
        const map = new Map<string, string>();
        allCategories.forEach(cat => {
            map.set(cat._id, cat.name);
        });
        return map;
    }, [allCategories]);

    const openDialog = (subcategory: Subcategory | null = null) => {
        setSelectedSubcategory(subcategory);
        setIsDialogOpen(true);
    };

    const openAlertDialog = (subcategory: Subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsAlertOpen(true);
    };

    const columns = React.useMemo(() => getSubcategoryColumns({ openDialog, openAlertDialog, categoryNameMap }), [categoryNameMap]);

    const table = useDataTableInstance({
        data,
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
                const newData = await getSubcategories(null, { page: pageIndex + 1, limit: pageSize });
                setData(newData.data.subcategories);
                setPageCount(newData.total_pages);
            } catch (error) {
                toast.error("Failed to fetch subcategories.");
            }
        };

        fetchNewData();
    }, [pageIndex, pageSize, refetchTrigger]);

    const handleFormSubmit = async (formData: SubcategoryFormValues) => {
        try {
            if (selectedSubcategory) {
                await updateSubcategory(selectedSubcategory._id, formData);
                toast.success(tCommon("successUpdate"));
            } else {
                await createSubcategory(formData);
                toast.success(tCommon("successCreate"));
            }
            setIsDialogOpen(false);
            setSelectedSubcategory(null);
            setRefetchTrigger(prev => prev + 1);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("A subcategory with this name already exists.");
            } else {
                console.error("Failed to save subcategory:", error);
                toast.error(tCommon("error"));
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedSubcategory) return;
        try {
            await deleteSubcategory(selectedSubcategory._id);
            toast.success(tCommon("successDelete"));
            setRefetchTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Failed to delete subcategory:", error);
            toast.error(tCommon("errorDelete"));
        } finally {
            setIsAlertOpen(false);
            setSelectedSubcategory(null);
        }
    };


    return (
        <Tabs defaultValue="all-subcategories" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="all-subcategories">{t("title")}</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <Button variant="outline" size="sm" onClick={() => openDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden lg:inline">{t("add")}</span>
                    </Button>
                </div>
            </div>
            <TabsContent value="all-subcategories" className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden rounded-lg border">
                    <DataTableNew table={table} columns={columns} />
                </div>
                <DataTablePagination table={table} />
            </TabsContent>

            {isDialogOpen && (
                <SubcategoryDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    subcategory={selectedSubcategory}
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
                        <AlertDialogCancel onClick={() => setSelectedSubcategory(null)}>
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