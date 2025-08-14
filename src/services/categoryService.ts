import { axiosInstance } from '@/src/lib/axios';
import { axiosServerInstance } from '@/src/lib/axios-server';

export const getCategories = async (accessToken: string | null, params = {}) => {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axiosServerInstance.get('/categories', { params, headers });
    return response.data;
};

export const createCategory = async (formData: FormData) => {
    const response = await axiosInstance.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateCategory = async (id: string, formData: FormData) => {
    const response = await axiosInstance.patch(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
};