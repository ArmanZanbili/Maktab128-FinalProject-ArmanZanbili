'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/src/stores/cart-store';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { PersianDatePicker } from '../molecules/PersianDatePicker';
import { DayRange } from '@hassanmojab/react-modern-calendar-datepicker';
import moment from 'jalali-moment';


export function CheckoutPageTemplate() {
    const { data: session } = useSession();
    const router = useRouter();
    const { items, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [address, setAddress] = React.useState('');
    const [discountCode, setDiscountCode] = React.useState('');
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');

    const [selectedDayRange, setSelectedDayRange] = React.useState<DayRange>({
        from: null,
        to: null,
    });

    const validItems = items.filter(item => item && item.movie && typeof item.movie.price === 'number');
    const subtotal = validItems.reduce((acc, item) => acc + item.movie.price * item.quantity, 0);

    useEffect(() => {
        if (validItems.length === 0 && !isProcessing) {
            toast.info("Your cart is empty. Redirecting...");
            router.push('/cart');
        }
    }, [validItems.length, isProcessing, router]);

    React.useEffect(() => {
        if (session?.user?.address) {
            setAddress(session.user.address);
        }
    }, [session?.user?.address]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) {
            toast.error("Please log in to place an order.");
            router.push('/login');
            return;
        }
        if (validItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }
        if (!address.trim()) {
            toast.error("Please enter a shipping address.");
            return;
        }
        if (!selectedDayRange?.from) {
            toast.error("Please select a delivery date.");
            return;
        }

        setIsProcessing(true);
        try {

            const deliveryDateFrom = moment.from(`${selectedDayRange.from.year}/${selectedDayRange.from.month}/${selectedDayRange.from.day}`, 'fa', 'YYYY/MM/DD').toDate();

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: validItems,
                    shippingAddress: address,
                    discountCode: discountCode,
                    deliveryDate: deliveryDateFrom,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create order');
            }

            toast.success("Order placed successfully! Thank you for your purchase.");
            clearCart();
            router.push('/');
        } catch (error: any) {
            toast.error(`Order Failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (validItems.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping & Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Full Shipping Address</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="123 Filmetto St, Movie City, 12345"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Select Delivery Date</CardTitle>
                            <CardDescription>Choose a convenient date range for your delivery.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <PersianDatePicker
                                selectedDayRange={selectedDayRange}
                                setSelectedDayRange={setSelectedDayRange}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="divide-y max-h-64 overflow-y-auto">
                                {validItems.map(({ movie, quantity }) => (
                                    <li key={movie._id} className="flex items-center gap-4 py-2">
                                        <Image src={`${backendBaseUrl}/images/products/thumbnails/${movie.thumbnail}`} alt={movie.name} width={60} height={90} className="rounded-md object-cover aspect-[2/3]" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{movie.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                                        </div>
                                        <p className="font-medium text-sm">${(movie.price * quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                            <Separator />
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Discount Code"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                />
                                <Button type="button" variant="outline" onClick={() => toast.info('Discount logic is handled at checkout.')}>Apply</Button>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" size="lg" disabled={isProcessing || validItems.length === 0}>
                                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isProcessing ? "Placing Order..." : "Place Order"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
}