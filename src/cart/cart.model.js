import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
});

const cartSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer is required test"],
    },
    products: [cartItemSchema], 
    total: {
        type: Number,
        default: 0.00,
    },
});

export default mongoose.model("Cart", cartSchema);