const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    state: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: 'OTHERS',
        enum: ['FOOD', 'DRINKS', 'OTHERS']
    },
    stock: {
        type: Number,
        default: 0
    },
    description: { type: String },
    available: { type: Boolean, default: true },
});

module.exports = model('Product', ProductSchema);