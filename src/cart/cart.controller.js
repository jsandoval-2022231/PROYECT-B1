import { response, request } from "express";
import Product from '../product/product.model.js';
import Cart from './cart.model.js';

export const createCart = async (req, res) => {
    const customer = req.user._id;
    console.log(customer);
    const { products } = req.body;
    
    const customerCart = await Cart.findOne({ customer });
    if (!customerCart) {
        const cart = new Cart({ customer, products });
        await cart.save();
        res.status(201).json({msg: "YOUR CART", cart});
    } else {
        customerCart.products.push(...products);
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