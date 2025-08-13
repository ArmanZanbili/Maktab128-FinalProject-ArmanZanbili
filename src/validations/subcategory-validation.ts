import { z } from 'zod';

export const subcategoryFormSchema = z.object({
    name: z.string().min(2, "Admin.validation.name_min_2"),
    category: z.string().nonempty("Admin.validation.category_required"),
});

export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;