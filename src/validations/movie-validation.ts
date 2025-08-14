import { z } from 'zod';

export const movieFormSchema = z.object({
    name: z.string().min(3, "Admin.validation.name_min_3"),
    price: z.string()
        .min(1, "Admin.validation.price_required")
        .refine((val) => !isNaN(parseFloat(val)), {
            message: "Admin.validation.price_invalid",
        }),
    quantity: z.string()
        .min(1, "Admin.validation.quantity_required")
        .refine((val) => /^\d+$/.test(val), {
            message: "Admin.validation.quantity_invalid",
        }),
    brand: z.string().min(2, "Admin.validation.brand_required"),
    description: z.string().min(10, "Admin.validation.description_min_10"),
    categories: z.array(z.string()).min(1, "You must select at least one category."),
    subcategories: z.array(z.string()).min(1, "You must select at least one subcategory."),
    thumbnail: z.any().optional(),
    images: z.any().optional(),
});

export type MovieFormValues = z.infer<typeof movieFormSchema>;