import { z } from 'zod';

export const categoryFormSchema = z.object({
    name: z.string().min(2, "Admin.validation.name_min_2"),
    icon: z.any().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;