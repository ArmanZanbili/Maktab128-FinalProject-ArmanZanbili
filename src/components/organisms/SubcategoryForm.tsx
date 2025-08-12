"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { subcategoryFormSchema, SubcategoryFormValues } from '@/src/validations/subcategory-validation';
import { Subcategory, Category } from '@/types/movie';
import { getCategories } from '@/src/services/categoryService';

export function SubcategoryForm({ subcategory, onSubmit, onFinished }: { subcategory?: Subcategory | null; onSubmit: (data: SubcategoryFormValues) => void; onFinished: () => void; }) {
    const [categories, setCategories] = useState<Category[]>([]);

    const form = useForm<SubcategoryFormValues>({
        resolver: zodResolver(subcategoryFormSchema),
        defaultValues: {
            name: subcategory?.name || "",
            category: subcategory?.category || "",
        },
    });

    useEffect(() => {
        getCategories({ limit: 100 }).then(res => setCategories(res.data.categories));
    }, []);

    const handleFormSubmit = (data: SubcategoryFormValues) => {
        onSubmit(data);
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subcategory Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Sci-Fi" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a parent category" /></SelectTrigger></FormControl>
                            <SelectContent>{categories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full">Save Subcategory</Button>
            </form>
        </Form>
    );
}