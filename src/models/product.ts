import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slugname: string;
    price: number;
    offPercent: number;
    quantity: number;
    brand: string;
    description: string;
    thumbnail: string;
    images: string[];
    categories: Schema.Types.ObjectId[];
    subcategories: Schema.Types.ObjectId[];
    rating: {
        rate: number;
        count: number;
    };
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        unique: true,
        required: [true, 'name is required'],
        trim: true,
    },
    slugname: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
    },
    offPercent: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    brand: {
        type: String,
        required: [true, 'brand is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        trim: true,
    },
    thumbnail: {
        type: String,
        trim: true,
        default: 'products-thumbnails-default.jpeg',
    },
    images: {
        type: [String],
        default: ['products-images-default.jpeg'],
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    subcategories: [{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
    }],
    rating: {
        rate: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});

export default models.Product || model<IProduct>('Product', ProductSchema);