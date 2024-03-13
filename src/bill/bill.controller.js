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
            .populate('products', 'name')
    ]);

    res.status(200).json({ total, bills });
}

// TEST 1
// export const getBillByCustomer = async (req = request, res = response) => {
//     const { id } = req.params;
//     console.log(id);

//     const bill = await Bill.findOne({ customer: id })
//             .populate('customer', 'name') 
//             .populate('products', 'name');

//     res.status(200).json({ bill });

// }

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



// TEST CREATE BILL

// export const createBill = async (req, res) => {
//     const { customer, products, total } = req.body;
//     console.log(req.body);

//     const bill = new Bill({ customer, products, total });

//     await bill.save();

//     res.status(201).json({ bill });
// }

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

