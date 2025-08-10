import axiosInstance from '../lib/axios';
import { z } from 'zod';
import { signupSchema } from '../validations/auth-validation';


type SignupData = z.infer<typeof signupSchema>;


export async function loginUser(username: string, password: string): Promise<any> {
    const response = await axiosInstance.post('/auth/login', {
        username,
        password,
    });
    return response.data;
}


export async function signupUser(userData: SignupData): Promise<any> {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
}