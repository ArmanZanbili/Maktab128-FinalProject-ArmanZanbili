import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Errors.username_required' }),
    password: z.string().min(1, { message: 'Errors.password_required' }),
});

export const signupSchema = z.object({
    firstname: z.string().min(1, { message: 'Errors.firstname_required' }),
    lastname: z.string().min(1, { message: 'Errors.lastname_required' }),
    username: z.string()
        .min(1, { message: 'Errors.username_required' })
        .min(3, { message: 'Errors.username_min' }),
    password: z.string()
        .min(1, { message: 'Errors.password_required' })
        .min(8, { message: 'Errors.password_min' }),
    phoneNumber: z.string()
        .min(1, { message: 'Errors.phoneNumber_required' })
        .min(10, { message: 'Errors.phoneNumber_min' }),
    address: z.string()
        .min(1, { message: 'Errors.address_required' })
        .min(5, { message: 'Errors.address_min' }),
});