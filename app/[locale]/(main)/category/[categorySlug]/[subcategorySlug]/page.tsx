import { getCategories } from "@/src/services/categoryService";
import { getSubcategories } from "@/src/services/subcategoryService";
import { getMovies } from "@/src/services/movieService";
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { ArchivePageTemplate } from "@/src/components/templates/ArchivePageTemplate";
import { Category, Subcategory } from "@/types/movie";

type Props = {
    params: Promise<{
        categorySlug: string;
        subcategorySlug: string;
    }>;
};

export default async function SubcategoryInCategoryPage({ params }: Props) {
    const resolvedParams = await params;
    const { categorySlug, subcategorySlug } = resolvedParams;
    const session = await auth();
    const token = session?.user.accessToken ?? null;

    try {
        const categoryResponse = await getCategories(token, { slugname: categorySlug });
        if (!categoryResponse.data.categories || categoryResponse.data.categories.length === 0) {
            notFound();
        }
        const category: Category = categoryResponse.data.categories[0];

        const subcategoryResponse = await getSubcategories(token, {
            slugname: subcategorySlug,
            category: category._id
        });
        if (!subcategoryResponse.data.subcategories || subcategoryResponse.data.subcategories.length === 0) {
            notFound();
        }
        const subcategory: Subcategory = subcategoryResponse.data.subcategories[0];

        const moviesResponse = await getMovies(token, {
            categories: category._id,
            subcategories: subcategory._id
        });

        const pageTitle = `${category.name}: ${subcategory.name}`;

        return (
            <ArchivePageTemplate
                title={pageTitle}
                movies={moviesResponse.data.products}
            />
        );
    } catch (error) {
        console.error("Failed to fetch data for subcategory page:", error);
        notFound();
    }
}