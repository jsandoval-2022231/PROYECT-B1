import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },

});

export default mongoose.model("Category", categorySchema);