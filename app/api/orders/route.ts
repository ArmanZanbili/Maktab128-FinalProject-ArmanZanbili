import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Order from '@/src/models/order';
import product from '@/src/models/product';
import { auth } from '@/src/lib/auth';
import { Movie } from '@/types/movie';

interface CartItemPayload {
    movie: Movie;
    quantity: number;
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await request.json();
        const { items, shippingAddress, discountCode }: { items: CartItemPayload[], shippingAddress: string, discountCode?: string } = body;

        if (!items || items.length === 0 || !shippingAddress) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const productDetails = await product.find({
            '_id': { $in: items.map(item => item.movie._id) }
        });

        const priceMap = productDetails.reduce((map, product) => {
            map[product._id.toString()] = product.price;
            return map;
        }, {});

        let totalPrice = items.reduce((acc, item) => {
            const price = priceMap[item.movie._id] || 0;
            return acc + price * item.quantity;
        }, 0);

        if (discountCode === 'FILMETTO10') {
            totalPrice *= 0.9;
        }

        const newOrder = new Order({
            user: session.user.id,
            products: items.map(item => ({
                product: item.movie._id,
                count: item.quantity,
            })),
            shippingAddress,
            discountCode,
            totalPrice,
        });

        await newOrder.save();

        return NextResponse.json({ message: 'Order created successfully', order: newOrder }, { status: 201 });
    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}