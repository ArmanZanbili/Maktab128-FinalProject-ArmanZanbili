"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react'; // 👈 1. Import useSession
import { toast } from 'react-toastify'; // 👈 2. Import toast for error handling
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { subcategoryFormSchema, SubcategoryFormValues } from '@/src/validations/subcategory-validation';
import { Subcategory, Category } from '@/types/movie';
import { getCategories } from '@/src/services/categoryService';

export function SubcategoryForm({ subcategory, onSubmit, onFinished }: { subcategory?: Subcategory | null; onSubmit: (data: SubcategoryFormValues) => void; onFinished: () => void; }) {
    const t = useTranslations('Admin.subcategories.form');
    const tValidation = useTranslations('Admin.validation');
    const { data: session } = useSession(); // 👈 3. Get session data
    const [categories, setCategories] = useState<Category[]>([]);

    const form = useForm<SubcategoryFormValues>({
        resolver: zodResolver(subcategoryFormSchema),
        defaultValues: {
            name: subcategory?.name || "",
            category: subcategory?.category || "",
        },
    });

    useEffect(() => {
        async function fetchCategories() {
            const token = session?.user?.accessToken;
            if (token) {
                try {
                    const response = await getCategories(token, { limit: 100 });
                    setCategories(response.data.categories);
                } catch (error) {
                    toast.error("Failed to load parent categories.");
                }
            }
        }
        fetchCategories();
    }, [session]);

    const handleFormSubmit = (data: SubcategoryFormValues) => {
        onSubmit(data);
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('nameLabel')}</FormLabel>
                        <FormControl><Input placeholder={t('namePlaceholder')} {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.name && tValidation(form.formState.errors.name.message as any)}</FormMessage>
                    </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('parentLabel')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t('parentPlaceholder')} /></SelectTrigger></FormControl>
                            <SelectContent>{categories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.category && tValidation(form.formState.errors.category.message as any)}</FormMessage>
                    </FormItem>
                )} />
                <Button type="submit" className="w-full">{t('saveButton')}</Button>
            </form>
        </Form>
    );
}