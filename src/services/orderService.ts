import { axiosInstance } from '@/src/lib/axios';
import { CartItem } from '../stores/cart-store';

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