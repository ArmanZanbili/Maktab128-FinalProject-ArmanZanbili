import { axiosInstance } from '@/src/lib/axios';
import { ProfileFormValues } from '../validations/profile-validation';

export const getUserProfile = async (id: string) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
};

export const updateUserProfile = async (data: ProfileFormValues) => {
    const response = await axiosInstance.patch(`/users/update-me`, data);
    return response.data;
};