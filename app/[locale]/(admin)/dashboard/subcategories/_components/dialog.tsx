"use client";

import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/src/components/ui/dialog";
import { SubcategoryForm } from "./form";
import { Subcategory } from "@/types/movie";
import { SubcategoryFormValues } from "@/src/validations/subcategory-validation";

export function SubcategoryDialog({
    isOpen,
    setIsOpen,
    subcategory,
    onSubmit,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    subcategory?: Subcategory | null;
    onSubmit: (data: SubcategoryFormValues) => void;
}) {
    const t = useTranslations("Admin.subcategories");

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{subcategory ? t("edit") : t("add")}</DialogTitle>
                    <DialogDescription>
                        {subcategory ? 'Update the subcategory details below.' : 'Fill in the details to add a new subcategory.'}
                    </DialogDescription>
                </DialogHeader>
                <SubcategoryForm
                    subcategory={subcategory}
                    onSubmit={onSubmit}
                    onFinished={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
