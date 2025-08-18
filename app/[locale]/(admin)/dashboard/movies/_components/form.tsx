"use client";

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { MultiSelect, MultiSelectOption } from '@/src/components/ui/multi-select';
import { movieFormSchema, MovieFormValues } from '@/src/validations/movie-validation';
import { Movie, Category, Subcategory } from '@/types/movie';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { TiptapEditor } from '@/src/components/molecules/TiptapEditor';

export function MovieForm({
    movie,
    onSubmit,
    onFinished,
    categories,
    subcategories,
}: {
    movie?: Movie | null;
    onSubmit: (data: FormData) => void;
    onFinished: () => void;
    categories: Category[];
    subcategories: Subcategory[];
}) {

    const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(null);
    const [imagesPreview, setImagesPreview] = React.useState<string[]>([]);

    const form = useForm<MovieFormValues>({
        resolver: zodResolver(movieFormSchema),
        defaultValues: {
            name: movie?.name || "",
            price: String(movie?.price || ''),
            quantity: String(movie?.quantity || ''),
            brand: movie?.brand || "",
            description: movie?.description || "",
            categories: movie?.categories?.map(c => typeof c === 'string' ? c : c._id) || [],
            subcategories: movie?.subcategories?.map(s => typeof s === 'string' ? s : s._id) || [],
            thumbnail: undefined,
            images: undefined,
        },
    });

    const { control, watch, register, setValue, getValues } = form;
    const watchedCategories = watch("categories");

    const { ref: thumbnailRef, onChange: onThumbnailChange, ...thumbnailRest } = register("thumbnail");
    const { ref: imagesRef, ...imagesRest } = register("images");

    const subcategoryOptions: MultiSelectOption[] = React.useMemo(() => {
        if (!watchedCategories || watchedCategories.length === 0) return [];
        const categoryNameMap = new Map(categories.map(c => [c._id, c.name]));
        return subcategories
            .filter(sub => watchedCategories.includes(typeof sub.category === 'object' ? sub.category._id : sub.category))
            .map(sub => {
                const parentId = typeof sub.category === 'object' ? sub.category._id : sub.category;
                return { value: sub._id, label: sub.name, group: categoryNameMap.get(parentId) || 'Unknown' };
            });
    }, [watchedCategories, categories, subcategories]);

    const handleRemoveThumbnail = () => {
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        setThumbnailPreview(null);
        setValue('thumbnail', undefined, { shouldValidate: true });
    };

    const handleRemoveGalleryImage = (indexToRemove: number) => {
        URL.revokeObjectURL(imagesPreview[indexToRemove]);
        setImagesPreview(prev => prev.filter((_, index) => index !== indexToRemove));
        const currentFiles = getValues('images') || [];
        const updatedFiles = Array.from(currentFiles).filter((_, index) => index !== indexToRemove);
        setValue('images', updatedFiles, { shouldValidate: true });
    };

    const handleFormSubmit: SubmitHandler<MovieFormValues> = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('quantity', data.quantity);
        formData.append('brand', data.brand);
        formData.append('description', data.description);

        if (data.categories && Array.isArray(data.categories)) {
            data.categories.forEach(catId => formData.append('categories', catId));
        }
        if (data.subcategories && Array.isArray(data.subcategories)) {
            data.subcategories.forEach(subId => formData.append('subcategories', subId));
        }
        if (data.thumbnail && data.thumbnail[0]) {
            formData.append('thumbnail', data.thumbnail[0]);
        }
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }
        onSubmit(formData);
        onFinished();
    };

    React.useEffect(() => {
        return () => {
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
            imagesPreview.forEach(url => URL.revokeObjectURL(url));
        };
    }, [thumbnailPreview, imagesPreview]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <ScrollArea className="h-[65vh] pr-6">
                    <div className="space-y-6 pr-6">
                        <FormField control={control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="price" render={({ field }) => (
                                <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={control} name="quantity" render={({ field }) => (
                                <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={control} name="brand" render={({ field }) => (
                            <FormItem><FormLabel>Brand / Studio</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Categories</FormLabel>
                                        <MultiSelect
                                            options={categories.map(c => ({ value: c._id, label: c.name }))}
                                            selected={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select parent categories..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="subcategories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subcategories</FormLabel>
                                        <MultiSelect
                                            options={subcategoryOptions}
                                            selected={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select subcategories..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField control={control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <TiptapEditor value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="p-4 border rounded-lg space-y-2">
                                <FormLabel>Thumbnail Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        ref={thumbnailRef}
                                        {...thumbnailRest}
                                        onChange={(e) => {
                                            onThumbnailChange(e);
                                            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
                                            const file = e.target.files?.[0];
                                            setThumbnailPreview(file ? URL.createObjectURL(file) : null);
                                        }}
                                    />
                                </FormControl>
                                {thumbnailPreview && (
                                    <div className="mt-2 relative aspect-video w-full">
                                        <Image src={thumbnailPreview} alt="Thumbnail preview" layout="fill" className="rounded-md object-cover" />
                                        <button
                                            type="button"
                                            className="absolute z-10 top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/75 cursor-pointer"
                                            onClick={handleRemoveThumbnail}
                                        >
                                            <span className="sr-only">Remove thumbnail</span>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                <FormMessage>{form.formState.errors.thumbnail?.message as string}</FormMessage>
                            </div>

                            <div className="p-4 border rounded-lg space-y-2">
                                <FormLabel>Gallery Images</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        ref={imagesRef}
                                        {...imagesRest}
                                        onChange={(e) => {
                                            const newFiles = Array.from(e.target.files || []);
                                            const currentFiles = getValues('images') || [];
                                            const combinedFiles = [...currentFiles, ...newFiles];
                                            setValue('images', combinedFiles, { shouldValidate: true });

                                            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
                                            setImagesPreview(prev => [...prev, ...newPreviews]);
                                        }}
                                    />
                                </FormControl>

                                {imagesPreview.length > 0 && (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {imagesPreview.map((url, index) => (
                                            <div key={index} className="relative aspect-square">
                                                <Image src={url} alt={`Gallery preview ${index + 1}`} layout="fill" className="rounded-md object-cover" />
                                                <button
                                                    type="button"
                                                    className="absolute z-10 top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/75 cursor-pointer"
                                                    onClick={() => handleRemoveGalleryImage(index)}
                                                >
                                                    <span className="sr-only">Remove image {index + 1}</span>
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <FormMessage>{form.formState.errors.images?.message as string}</FormMessage>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="flex-shrink-0 pt-6">
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : "Save Movie"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}