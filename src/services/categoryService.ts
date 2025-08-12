import axiosInstance from '@/src/lib/axios';
import { getSession } from 'next-auth/react';

async function getAuthHeaders() {
    const session = await getSession();
    if (!session?.user.accessToken) throw new Error("Not authenticated");
    return {
        Authorization: `Bearer ${session.user.accessToken}`,
        'Content-Type': 'multipart/form-data',
    };
}

export const getCategories = async (params = {}) => {
    const response = await axiosInstance.get('/categories', { params });
    return response.data;
};

export const createCategory = async (formData: FormData) => {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.post('/categories', formData, { headers });
    return response.data;
};

export const updateCategory = async (id: string, formData: FormData) => {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.patch(`/categories/${id}`, formData, { headers });
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const session = await getSession();
    const headers = { Authorization: `Bearer ${session?.user.accessToken}` };
    const response = await axiosInstance.delete(`/categories/${id}`, { headers });
    return response.data;
};