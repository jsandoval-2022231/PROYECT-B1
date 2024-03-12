import mongoose from "mongoose";

const billSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer is required"],
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: [true, "Cart is required"],
    },
    status: {
        type: String,
        enum: ['PAID', 'AWAITING_PAYMENT'],
        default: 'AWAITING_PAYMENT',
    },
});

export default mongoose.model("Bill", billSchema);