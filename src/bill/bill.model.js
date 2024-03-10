import mongoose from "mongoose";

const billSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer is required"],
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
    }],
    total: {
        type: Number,
        required: [true, "Total is required"],
    },
    status: {
        type: String,
        enum: ['PAID', 'AWAITING_PAYMENT'],
        default: 'AWAITING_PAYMENT',
    },
});

export default mongoose.model("Bill", billSchema);