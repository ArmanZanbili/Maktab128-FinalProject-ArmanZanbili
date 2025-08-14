"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";
import {
    categoryFormSchema,
    CategoryFormValues,
} from "@/src/validations/category-validation";
import { Category } from "@/types/movie";

export function CategoryForm({
    category,
    onSubmit,
    onFinished,
}: {
    category?: Category | null;
    onSubmit: (data: FormData) => void;
    onFinished: () => void;
}) {
    const t = useTranslations("Admin.categories.form");
    const tValidation = useTranslations("Admin.validation");

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: category?.name || "",
            icon: undefined,
        },
    });

    const handleFormSubmit: SubmitHandler<CategoryFormValues> = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.icon && data.icon[0]) {
            formData.append("icon", data.icon[0]);
        }
        onSubmit(formData);
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("nameLabel")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("namePlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage>
                                {form.formState.errors.name &&
                                    tValidation(form.formState.errors.name.message as any)}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                            <FormLabel>{t("iconLabel")}</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...rest}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : t("saveButton")}
                </Button>
            </form>
        </Form>
    );
}
