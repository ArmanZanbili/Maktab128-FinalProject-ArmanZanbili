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

export const getMovies = async (params = {}) => {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
};

export const createMovie = async (formData: FormData) => {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.post('/products', formData, { headers });
    return response.data;
};

export const updateMovie = async (id: string, formData: FormData) => {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.patch(`/products/${id}`, formData, { headers });
    return response.data;
};

export const deleteMovie = async (id: string) => {
    const session = await getSession();
    const headers = { Authorization: `Bearer ${session?.user.accessToken}` };
    const response = await axiosInstance.delete(`/products/${id}`, { headers });
    return response.data;
};