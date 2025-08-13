"use client";

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCategories } from '@/src/services/categoryService';
import { getSubcategories } from '@/src/services/subcategoryService';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import { movieFormSchema, MovieFormValues } from '@/src/validations/movie-validation';
import { Movie, Category, Subcategory } from '@/types/movie';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

export function MovieForm({ movie, onSubmit, onFinished }: { movie?: Movie | null; onSubmit: (data: FormData) => void; onFinished: () => void; }) {
    const t = useTranslations('Admin.movies.form');
    const tValidation = useTranslations('Admin.validation');

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    const form = useForm<MovieFormValues>({
        resolver: zodResolver(movieFormSchema),
        defaultValues: {
            name: movie?.name || "",
            price: String(movie?.price || ''),
            quantity: String(movie?.quantity || ''),
            brand: movie?.brand || "",
            description: movie?.description || "",
            category: movie?.category._id || "",
            subcategory: movie?.subcategory._id || "",
        },
    });

    const selectedCategory = form.watch("category");

    useEffect(() => {
        getCategories({ limit: 100 })
            .then(res => setCategories(res.data.categories))
            .catch(() => toast.error("Failed to load categories."));
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            getSubcategories({ category: selectedCategory, limit: 100 })
                .then(res => setSubcategories(res.data.subcategories))
                .catch(() => toast.error("Failed to load subcategories."));
            form.setValue('subcategory', '');
        } else {
            setSubcategories([]);
        }
    }, [selectedCategory, form]);

    const handleFormSubmit: SubmitHandler<MovieFormValues> = (data) => {
        const formData = new FormData();
        (Object.keys(data) as Array<keyof MovieFormValues>).forEach(key => {
            const value = data[key];
            if (key === 'thumbnail' && value?.[0]) {
                formData.append(key, value[0]);
            } else if (key === 'images' && value?.length) {
                for (let i = 0; i < value.length; i++) formData.append('images', value[i]);
            } else if (value !== undefined && value !== null && value !== '') {
                formData.append(key, String(value));
            }
        });
        onSubmit(formData);
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('titleLabel')}</FormLabel>
                        <FormControl><Input placeholder={t('titlePlaceholder')} {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.name && tValidation(form.formState.errors.name.message as any)}</FormMessage>
                    </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('priceLabel')}</FormLabel>
                            <FormControl><Input type="number" placeholder={t('pricePlaceholder')} {...field} /></FormControl>
                            <FormMessage>{form.formState.errors.price && tValidation(form.formState.errors.price.message as any)}</FormMessage>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('quantityLabel')}</FormLabel>
                            <FormControl><Input type="number" placeholder={t('quantityPlaceholder')} {...field} /></FormControl>
                            <FormMessage>{form.formState.errors.quantity && tValidation(form.formState.errors.quantity.message as any)}</FormMessage>
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('brandLabel')}</FormLabel>
                        <FormControl><Input placeholder={t('brandPlaceholder')} {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.brand && tValidation(form.formState.errors.brand.message as any)}</FormMessage>
                    </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('categoryLabel')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t('categoryPlaceholder')} /></SelectTrigger></FormControl>
                            <SelectContent>{categories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.category && tValidation(form.formState.errors.category.message as any)}</FormMessage>
                    </FormItem>
                )} />
                <FormField control={form.control} name="subcategory" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('subcategoryLabel')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={!selectedCategory || subcategories.length === 0}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t('subcategoryPlaceholder')} /></SelectTrigger></FormControl>
                            <SelectContent>{subcategories.map((sub) => <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.subcategory && tValidation(form.formState.errors.subcategory.message as any)}</FormMessage>
                    </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('descriptionLabel')}</FormLabel>
                        <FormControl><Textarea placeholder={t('descriptionPlaceholder')} {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.description && tValidation(form.formState.errors.description.message as any)}</FormMessage>
                    </FormItem>
                )} />
                <FormField control={form.control} name="thumbnail" render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>{t('thumbnailLabel')}</FormLabel>
                        <FormControl><Input type="file" onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="images" render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>{t('galleryLabel')}</FormLabel>
                        <FormControl><Input type="file" multiple onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full">
                    {form.formState.isSubmitting ? t('savingButton') : t('saveButton')}
                </Button>
            </form>
        </Form>
    );
}