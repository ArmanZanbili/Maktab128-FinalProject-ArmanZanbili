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
    const t = useTranslations('AdminSidebar');
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
            .catch(err => {
                console.error(err);
                toast.error("Failed to load categories.");
            });
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            getSubcategories({ category: selectedCategory, limit: 100 }).then(res => setSubcategories(res.data.subcategories));
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
                formData.append(key, value);
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
                        <FormLabel>Movie Title</FormLabel>
                        <FormControl><Input placeholder="e.g., Inception" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 19.99" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Brand / Studio</FormLabel>
                        <FormControl><Input placeholder="e.g., Warner Bros." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                            <SelectContent>{categories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="subcategory" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={!selectedCategory || subcategories.length === 0}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a subcategory" /></SelectTrigger></FormControl>
                            <SelectContent>{subcategories.map((sub) => <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="A short summary of the movie..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="thumbnail" render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl><Input type="file" onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="images" render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Gallery Images</FormLabel>
                        <FormControl><Input type="file" multiple onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full">
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Movie'}
                </Button>
            </form>
        </Form>
    );
}