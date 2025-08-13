import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { SubcategoryForm } from "./SubcategoryForm";
import { Subcategory } from "@/types/movie";
import { SubcategoryFormValues } from "@/src/validations/subcategory-validation";
import { useTranslations } from "next-intl";

export function SubcategoryDialog({ isOpen, setIsOpen, subcategory, onSubmit }: { isOpen: boolean; setIsOpen: (open: boolean) => void; subcategory?: Subcategory | null; onSubmit: (data: SubcategoryFormValues) => void; }) {
    const t = useTranslations('Admin.subcategories');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{subcategory ? t('edit') : t('add')}</DialogTitle>
                </DialogHeader>
                <SubcategoryForm subcategory={subcategory} onSubmit={onSubmit} onFinished={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}