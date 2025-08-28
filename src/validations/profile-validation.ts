import { z } from 'zod';

export const profileSchema = z.object({
    firstname: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
    lastname: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
    phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;