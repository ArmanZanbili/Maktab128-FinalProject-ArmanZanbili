import { Button } from '@/src/components/ui/button';
import Image from 'next/image';

type ProductCardProps = {
    name: string;
    price: string;
    imageUrl: string;
    buttonText: string;
};

export function ProductCard({ name, price, imageUrl, buttonText }: ProductCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-2">
            <div className="aspect-square overflow-hidden bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="mt-1 text-base font-medium text-primary">{price}</p>
                <Button className="mt-4 w-full">{buttonText}</Button>
            </div>
        </div>
    );
}