'use client';

import * as React from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
    initialValue?: number;
    minValue?: number;
    maxValue?: number;
    onValueChange: (value: number) => void;
}

export function QuantitySelector({
    initialValue = 1,
    minValue = 1,
    maxValue = 99,
    onValueChange,
}: QuantitySelectorProps) {
    const [quantity, setQuantity] = React.useState(initialValue);

    const updateQuantity = (newValue: number) => {
        const clampedValue = Math.max(minValue, Math.min(newValue, maxValue));
        setQuantity(clampedValue);
        onValueChange(clampedValue);
    };

    const handleIncrement = () => {
        updateQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        updateQuantity(quantity - 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            updateQuantity(value);
        } else if (e.target.value === '') {
            setQuantity(minValue);
            onValueChange(minValue);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDecrement}
                disabled={quantity <= minValue}
            >
                <Minus className="h-4 w-4" />
            </Button>
            <Input
                type="number"
                className="h-8 w-20 text-center"
                value={quantity}
                onChange={handleChange}
                min={minValue}
                max={maxValue}
            />
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleIncrement}
                disabled={quantity >= maxValue}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}