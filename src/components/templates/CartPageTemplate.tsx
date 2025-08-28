'use client';

import * as React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/src/stores/cart-store';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { QuantitySelector } from '@/src/components/molecules/QuantitySelector';
import { FaTrash } from 'react-icons/fa6';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

export function CartPageTemplate() {
    const { data: session } = useSession();
    const router = useRouter();
    const { items, removeFromCart, updateItemQuantity, clearCart } = useCartStore();

    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');

    const validItems = items.filter(item => item && item.movie && typeof item.movie.price === 'number');

    const total = validItems.reduce((acc, item) => acc + item.movie.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!session?.user) {
            toast.error("Please log in to proceed to checkout.");
            router.push('/login');
            return;
        }
        router.push('/checkout');
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

            {validItems.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>Your cart is empty.</p>
                        <Button asChild className="mt-4">
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                    <div className="lg:col-span-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Your Items ({validItems.length})</CardTitle>
                                <Button variant="outline" size="sm" onClick={() => clearCart()}>
                                    Clear Cart
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ul className="divide-y">
                                    {validItems.map(({ movie, quantity }) => {
                                        const itemTotal = movie.price * quantity;
                                        return (
                                            <li key={movie._id} className="flex items-center gap-4 p-4">
                                                <Link href={`/movies/${movie._id}`} className="flex items-center gap-4 flex-1 group">
                                                    <Image
                                                        src={`${backendBaseUrl}/images/products/thumbnails/${movie.thumbnail}`}
                                                        alt={movie.name}
                                                        width={80}
                                                        height={120}
                                                        className="rounded-md object-cover aspect-[2/3]"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold group-hover:text-primary transition-colors">{movie.name}</h3>
                                                        <p className="text-sm text-muted-foreground">${movie.price.toFixed(2)} each</p>
                                                    </div>
                                                </Link>
                                                <div className="flex items-center gap-4 sm:gap-6">
                                                    <QuantitySelector
                                                        initialValue={quantity}
                                                        maxValue={movie.quantity}
                                                        onValueChange={(newQuantity) => updateItemQuantity(movie._id, newQuantity)}
                                                    />
                                                    <div className="w-20 text-right font-medium">
                                                        ${itemTotal.toFixed(2)}
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(movie._id)}>
                                                        <FaTrash className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={validItems.length === 0}
                                >
                                    Proceed to Checkout
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}