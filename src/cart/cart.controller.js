import { response, request } from "express";
import Product from '../product/product.model.js';
import Cart from './cart.model.js';

export const createCart = async (req, res) => {
    const customer = req.user._id;
    const { products } = req.body;

    let total = 0;

    for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ error: `Product not found for ID: ${item.product}` });
        }
        total += product.price * item.quantity;
    }
    
    const customerCart = await Cart.findOne({ customer });
    if (!customerCart) {
        const cart = new Cart({ customer, products, total });
        await cart.save();
        res.status(201).json({msg: "YOUR CART", cart});
    } else {
        customerCart.products.push(...products);
        customerCart.total += total;

        await customerCart.save();
        return res.status(200).json({msg: "YOUR CART", customerCart});
    }
}

export const getCart = async (req, res) => {
    const customer = req.user._id;
    const cart = await Cart
        .findOne({ customer })
        .populate('products.product');
    res.status(200).json({ cart });
}

export const updateCart = async (req, res) => {
    const customer = req.user._id;
    const { products } = req.body;
    const cart = await Cart.findOne({ customer: customer });

    if (!cart) {
        return res.status(400).json({msg: "Cart not found"});
    }

    cart.products = products;
    await cart.save();
    res.status(200).json({msg: "Cart updated", cart});
}