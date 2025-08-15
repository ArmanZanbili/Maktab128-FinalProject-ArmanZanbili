export type MovieCardProps = {
    title: string;
    price: string;
    ageRating: string;
    duration: string;
    genres: string;
    year: string;
    summary: string;
    rating: string;
    ratingLabel: string;
    imageUrl: string;
    priority?: boolean;
};

export type Category = {
    _id: string;
    name: string;
    icon?: string;
};

export type Subcategory = {
    _id: string;
    name: string;
    category: string | category;
};

export type Movie = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    brand: string;
    description: string;
    categories: (string | Category)[];
    subcategories: (string | Subcategory)[];
    thumbnail: string;
    images: string[];
};
