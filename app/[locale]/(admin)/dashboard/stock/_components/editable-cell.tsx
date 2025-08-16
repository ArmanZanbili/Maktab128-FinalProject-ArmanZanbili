"use client";

import * as React from "react";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

interface EditableCellProps {
    initialValue: string | number;
    onSave: (value: string) => void;
    isChanged: boolean;
    type?: "text" | "number";
    prefix?: string;
}

export function EditableCell({ initialValue, onSave, isChanged, type = "text", prefix }: EditableCellProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(String(initialValue));
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSave = () => {
        setIsEditing(false);
        if (String(initialValue) !== value) {
            onSave(value);
        }
    };

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    React.useEffect(() => {
        setValue(String(initialValue));
    }, [initialValue]);

    return (
        <div
            onClick={() => !isEditing && setIsEditing(true)}
            className={cn(
                "relative flex h-8 cursor-pointer items-center rounded-md px-2 py-1 transition-colors",
                isChanged ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-muted/50"
            )}
        >
            {isEditing ? (
                <Input
                    ref={inputRef}
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") {
                            setValue(String(initialValue));
                            setIsEditing(false);
                        }
                    }}
                    className="absolute inset-0 h-full w-full border-none bg-transparent px-2 shadow-none focus-visible:ring-0"
                />
            ) : (
                <>
                    {prefix && <span className="mr-1 text-muted-foreground">{prefix}</span>}
                    <span>
                        {type === 'number' ? parseFloat(String(initialValue)).toLocaleString() : initialValue}
                    </span>
                </>
            )}
        </div>
    );
}