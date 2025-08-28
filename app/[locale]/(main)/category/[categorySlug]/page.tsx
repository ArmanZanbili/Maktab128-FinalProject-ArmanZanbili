import { getCategories } from "@/src/services/categoryService";
import { getMovies } from "@/src/services/movieService";
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { ArchivePageTemplate } from "@/src/components/templates/ArchivePageTemplate";
import { Category } from "@/types/movie";

type Props = {
    params: Promise<{
        categorySlug: string;
    }>;
};

export default async function CategoryPage({ params }: Props) {
    const resolvedParams = await params;
    const { categorySlug } = resolvedParams;
    const session = await auth();
    const token = session?.user.accessToken ?? null;

    const categoriesResponse = await getCategories(token);
    const category = categoriesResponse.data.categories.find((cat: Category) => cat.slugname === categorySlug);

    if (!category) {
        notFound();
    }

    const moviesResponse = await getMovies(token, { categories: category._id });

    return (
        <ArchivePageTemplate
            title={category.name}
            movies={moviesResponse.data.products}
        />
    );
}