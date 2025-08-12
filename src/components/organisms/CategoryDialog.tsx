import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { Category } from "@/types/movie";

export function CategoryDialog({ isOpen, setIsOpen, category, onSubmit }: { isOpen: boolean; setIsOpen: (open: boolean) => void; category?: Category | null; onSubmit: (data: FormData) => void; }) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                </DialogHeader>
                <CategoryForm category={category} onSubmit={onSubmit} onFinished={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}