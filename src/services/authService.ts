
import { z } from 'zod';
import { signupSchema } from '../validations/auth-validation';
import { axiosServerInstance } from '../lib/axios-server';


type SignupData = z.infer<typeof signupSchema>;


export async function loginUser(username: string, password: string): Promise<any> {
    const response = await axiosServerInstance.post('/auth/login', {
        username,
        password,
    });
    return response.data;
}


export async function signupUser(userData: SignupData): Promise<any> {
    const response = await axiosServerInstance.post('/auth/signup', userData);
    return response.data;
}