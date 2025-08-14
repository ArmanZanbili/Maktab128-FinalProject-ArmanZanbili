"use client";

import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/src/components/ui/dialog";
import { Category } from "@/types/movie";
import { CategoryForm } from "./form";

export function CategoryDialog({
    isOpen,
    setIsOpen,
    category,
    onSubmit,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    category?: Category | null;
    onSubmit: (data: FormData) => void;
}) {
    const t = useTranslations("Admin.categories");

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{category ? t("edit") : t("add")}</DialogTitle>
                    <DialogDescription>
                        {category ? 'Update the category details below.' : 'Fill in the details to add a new category.'}
                    </DialogDescription>
                </DialogHeader>
                <CategoryForm
                    category={category}
                    onSubmit={onSubmit}
                    onFinished={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
