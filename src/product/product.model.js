import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    stock: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'NOT_AVAILABLE', 'RESERVED', 'SOLD_OUT', 'AWAITING_PAYMENT'],
        default: 'AVAILABLE',
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
});

export default mongoose.model("Product", productSchema);