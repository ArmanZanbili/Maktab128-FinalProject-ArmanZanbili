import { axiosInstance } from '@/src/lib/axios';
import { axiosServerInstance } from '@/src/lib/axios-server';
import { SubcategoryFormValues } from '../validations/subcategory-validation';

export const getSubcategories = async (accessToken: string | null, params = {}) => {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axiosServerInstance.get('/subcategories', { params, headers });
    return response.data;
};

export const createSubcategory = async (data: SubcategoryFormValues) => {
    const response = await axiosInstance.post('/subcategories', data);
    return response.data;
};

export const updateSubcategory = async (id: string, data: SubcategoryFormValues) => {
    const response = await axiosInstance.patch(`/subcategories/${id}`, data);
    return response.data;
};

export const deleteSubcategory = async (id: string) => {
    const response = await axiosInstance.delete(`/subcategories/${id}`);
    return response.data;
};