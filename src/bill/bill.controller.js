import { response, request } from "express";
import Product from '../product/product.model.js';
import Category from '../category/category.model.js';
import Bill from './bill.model.js';
import mongoose from "mongoose";
import Cart from '../cart/cart.model.js';

export const getBill = async (req = request, res = response) => {
    const query = { status: "PAID" };

    const [total, bills] = await Promise.all([
        Bill.countDocuments(query),
        Bill.find(query)
            .populate('customer', 'name')
            .populate('cart', 'name')
    ]);

    res.status(200).json({ total, bills });
}

export const getBillsByCustomer = async (req, res) => {
    const customerId = req.user._id;
    const query = { customer: customerId };

    const [total, bills] = await Promise.all([
        Bill.countDocuments(query),
        Bill.find(query)
            .populate('customer', 'name')
            .populate('cart', 'name')
            .populate({ path: 'cart', populate: { path: 'products.product', model: 'Product' } })
    ]);

    if(!bills){
        throw new Error('No bills found');
    }

    res.status(200).json({ total, bills });
}

export const getProductSeller = async (req, res) => {
    try {
        const query = { status: "PAID" };
        
        const [total, bills] = await Promise.all([
            Bill.countDocuments(query),
            Bill.find(query)
                .populate('customer', 'name')
                .populate({
                    path: 'cart',
                    select: 'name products',
                    populate: {
                        path: 'products.product',
                        model: 'Product',
                        select: 'name quantity'
                    }
                })
        ]);

        if (bills.length === 0) {
            return res.status(404).json({ message: "There's no bills added" });
        }

        const products = bills.reduce((acc, bill) => {
            bill.cart.products.forEach(item => {
                if (!acc[item.product.name]) {
                    acc[item.product.name] = 0;
                }
                acc[item.product.name] += item.quantity;
            });
            return acc;
        }, {});

        res.status(200).json({ total, products });
    } catch (error) {
        console.error("Error in getProductSeller:", error);
        res.status(500).json({ message: "Error trying to process this " });
    }
}


export const getBillByCustomer = async (req, res) => {
    const { id } = req.params;
    const query = { customer: id };
    
    console.log(id);
    const [total, bills] = await Promise.all([
        Bill.countDocuments(query),
        Bill.find(query)
            .populate('customer', 'name')
            .populate('products', 'name')
    ]);

    res.status(200).json({ total, bills });
}



export const payBill = async (req, res) => {
    const { id } = req.params;
    const bill = await Bill.findById(id);

    bill.status = "PAID";
    await bill.save();
    
    res.status(200).json({ 
        msg: "Bill paid successfully, thanks for you purchase", bill });
}

export const updateBill = async (req, res) => {
    const { id } = req.params;
    const { _id, customer, ...rest } = req.body;

    await Bill.findByIdAndUpdate(id, rest);

    const bill = await Bill.findOne({ _id: id });

    res.status(200).json({ 
        msg: "Bill updated successfully",
        bill });
}

export const createBill = async (req, res) =>{
    const customerId = req.user._id;
    console.log("customerId", customerId);

    try {
        const cart = await Cart.findOne({ customer: customerId }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const cartId = cart._id;
        console.log("cartId", cartId);

        for (const item of cart.products) {
            const product = item.product;
            console.log("product", product);
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
            }
        }

        const bill = new Bill({
            customer: customerId,
            cart: cartId,
            status: 'AWAITING_PAYMENT',
        });

        await bill.save();

        for (const item of cart.products) {
            const product = item.product;
            product.stock -= item.quantity;

            if(product.stock == 0){
                product.status = "SOLD_OUT"
            }
            await product.save();
        }
        await cart.save();

        return res.status(201).json({msg: 'Bill created', bill});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
