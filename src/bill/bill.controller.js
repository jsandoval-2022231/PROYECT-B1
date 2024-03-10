import { response, request } from "express";
import Product from '../product/product.model.js';
import Category from '../category/category.model.js';
import Bill from './bill.model.js';


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