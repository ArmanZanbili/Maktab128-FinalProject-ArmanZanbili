"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator, // <-- Import Separator
} from "@/src/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { Badge } from "@/src/components/ui/badge";

export type MultiSelectOption = {
    value: string;
    label: string;
    group?: string; // <-- Add optional group property
};

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    className?: string;
    placeholder?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    className,
    placeholder = "Select options...",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (value: string) => {
        const isSelected = selected.includes(value);
        if (isSelected) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const selectedLabels = selected.map(value => options.find(option => option.value === value)?.label).filter(Boolean);

    // --- NEW: Grouping Logic ---
    const groupedOptions = React.useMemo(() => {
        return options.reduce((acc, option) => {
            const group = option.group || 'General';
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(option);
            return acc;
        }, {} as Record<string, MultiSelectOption[]>);
    }, [options]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between h-auto", selected.length > 0 && "py-1.5")}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex gap-1 flex-wrap">
                        {selected.length > 0 ? (
                            selectedLabels.map(label => <Badge key={label} variant="secondary">{label}</Badge>)
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className={className}>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {/* --- CHANGED: Render groups --- */}
                        {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                            <CommandGroup key={group} heading={group}>
                                {groupOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected.includes(option.value)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}