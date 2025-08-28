import { User } from './movie';

export interface Order {
    _id: string;
    user: User;
    products: {
        product: {
            _id: string;
            name: string;
            price: number;
        };
        count: number;
    }[];
    shippingAddress: string;
    totalPrice: number;
    deliveryDate: string;
    deliveryStatus: boolean;
    createdAt: string;
    updatedAt: string;
}