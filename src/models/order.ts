import mongoose, { Schema, models, model, Document } from 'mongoose';

interface IOrder extends Document {
    user: Schema.Types.ObjectId;
    products: {
        product: Schema.Types.ObjectId;
        count: number;
    }[];
    shippingAddress: string;
    totalPrice: number;
    deliveryDate: Date;
    deliveryStatus: boolean;
    discountCode?: string;
}

const OrderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required'],
        },
        count: {
            type: Number,
            required: [true, 'Product count is required'],
        },
    }],
    shippingAddress: {
        type: String,
        required: [true, 'Shipping address is required'],
        trim: true,
    },
    discountCode: {
        type: String,
        trim: true,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    deliveryDate: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    deliveryStatus: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});



export default models.Order || model<IOrder>('Order', OrderSchema);