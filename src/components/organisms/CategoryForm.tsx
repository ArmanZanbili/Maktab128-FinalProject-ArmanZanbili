"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { categoryFormSchema, CategoryFormValues } from '@/src/validations/category-validation';
import { Category } from '@/types/movie';

export function CategoryForm({ category, onSubmit, onFinished }: { category?: Category | null; onSubmit: (data: FormData) => void; onFinished: () => void; }) {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: { name: category?.name || "" },
    });

    const handleFormSubmit = (data: CategoryFormValues) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.icon?.[0]) {
            formData.append('icon', data.icon[0]);
        }
        onSubmit(formData);
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Action" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="icon" render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Icon (Optional)</FormLabel>
                        <FormControl><Input type="file" onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full">Save Category</Button>
            </form>
        </Form>
    );
}