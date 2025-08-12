import axiosInstance from '@/src/lib/axios';
import { getSession } from 'next-auth/react';

async function getAuthHeaders() {
    const session = await getSession();
    if (!session?.user.accessToken) throw new Error("Not authenticated");
    return {
        Authorization: `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json',
    };
}

export const getSubcategories = async (params = {}) => {
    const response = await axiosInstance.get('/subcategories', { params });
    return response.data;
};

export const createSubcategory = async (data: { name: string; category: string }) => {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.post('/subcategories', data, { headers });
    return response.data;
};

export const updateSubcategory = async (id: string, data: { name: string; category: string }) => {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.patch(`/subcategories/${id}`, data, { headers });
    return response.data;
};

export const deleteSubcategory = async (id: string) => {
    const session = await getSession();
    const headers = { Authorization: `Bearer ${session?.user.accessToken}` };
    const response = await axiosInstance.delete(`/subcategories/${id}`, { headers });
    return response.data;
};