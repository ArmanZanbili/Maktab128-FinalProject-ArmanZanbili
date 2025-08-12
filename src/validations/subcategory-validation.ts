import { z } from 'zod';

export const subcategoryFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    category: z.string().nonempty("A parent category is required."),
});

export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;