import { z } from 'zod';

export const movieFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    price: z.string()
        .min(1, "Price is required.")
        .refine((val) => !isNaN(parseFloat(val)), {
            message: "Price must be a valid number.",
        }),
    quantity: z.string()
        .min(1, "Quantity is required.")
        .refine((val) => /^\d+$/.test(val), {
            message: "Quantity must be a whole number.",
        }),
    brand: z.string().min(2, "Brand is required."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    category: z.string().nonempty("Category is required."),
    subcategory: z.string().nonempty("Subcategory is required."),
    thumbnail: z.any().optional(),
    images: z.any().optional(),
});

export type MovieFormValues = z.infer<typeof movieFormSchema>;