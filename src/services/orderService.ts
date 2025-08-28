import { axiosInstance } from '@/src/lib/axios';
import { CartItem } from '../stores/cart-store';
import { axiosServerInstance } from '../lib/axios-server';

interface OrderPayload {
    user: string;
    products: {
        product: string;
        count: number;
    }[];
}

export const createOrder = async (userId: string, items: CartItem[]) => {
    const payload: OrderPayload = {
        user: userId,
        products: items.map(item => ({
            product: item.movie._id,
            count: item.quantity,
        })),
    };

    const response = await axiosInstance.post('/orders', payload);
    return response.data;
};

export const getOrdersByUser = async (userId: string) => {
    const response = await axiosInstance.get('/orders', {
        params: { user: userId, sort: '-createdAt' }
    });
    return response.data;
};

export const getOrders = async (accessToken: string | null) => {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axiosServerInstance.get('/orders', { headers });
    return response.data;
};

export const updateOrder = async (id: string, data: { deliveryStatus: boolean }) => {
    const response = await axiosInstance.patch(`/orders/${id}`, data);
    return response.data;
};