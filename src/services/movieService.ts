import { axiosInstance } from '@/src/lib/axios';
import { axiosServerInstance } from '@/src/lib/axios-server';
export const getMovies = async (accessToken: string | null, params = {}) => {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    const response = await axiosServerInstance.get('/products', { params, headers });
    return response.data;
};

export const createMovie = async (formData: FormData) => {
    const response = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateMovie = async (id: string, formData: FormData) => {
    const response = await axiosInstance.patch(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteMovie = async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
};