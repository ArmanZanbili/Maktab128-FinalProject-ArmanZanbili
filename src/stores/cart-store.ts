import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Movie } from '@/types/movie';
import { toast } from 'sonner';

export type CartItem = {
    movie: Movie;
    quantity: number;
};

interface CartState {
    items: CartItem[];
    addToCart: (item: Movie, quantity: number) => void;
    removeFromCart: (itemId: string) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (movie, quantity) => {
                const { items } = get();
                const itemExists = items.find((cartItem) => cartItem?.movie?._id === movie._id);

                if (itemExists) {
                    const newQuantity = itemExists.quantity + quantity;
                    if (newQuantity > movie.quantity) {
                        toast.error(`Only ${movie.quantity} copies of "${movie.name}" are available.`);
                        return;
                    }
                    set({
                        items: items.map((cartItem) =>
                            cartItem?.movie?._id === movie._id
                                ? { ...cartItem, quantity: newQuantity }
                                : cartItem
                        ),
                    });
                    toast.success(`Added ${quantity} more "${movie.name}" to cart!`);
                } else {
                    set({ items: [...items, { movie, quantity }] });
                    toast.success(`"${movie.name}" added to cart!`);
                }
            },
            removeFromCart: (itemId) => {
                set({ items: get().items.filter((item) => item?.movie?._id !== itemId) });
                toast.info("Item removed from cart.");
            },
            updateItemQuantity: (itemId, quantity) => {
                set({
                    items: get().items.map((item) => {
                        if (item?.movie?._id === itemId) {
                            return { ...item, quantity };
                        }
                        return item;
                    }),
                });
            },
            clearCart: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);