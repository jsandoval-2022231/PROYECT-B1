import { response, request } from "express";
import Product from './product.model.js';

export const getProducts = async (req = request, res = response) => {
    const query = { status: ['AVAILABLE', 'NOT_AVAILABLE', 'RESERVED', 'SOLD_OUT', 'AWAITING_PAYMENT'] };
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
    ]);

    res.status(200).json({ total, products });
}

export const getProductByName = async (req, res) => {
    const { name } = req.params;
    const product = await Product.findOne( { name: name } );

    res.status(200).json({ product });
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });

    res.status(200).json({ product });
}

export const getProductsSoldOut = async (req = request, res = response) => {
    const { limit, from } = req.query;
    const query = { status: "SOLD_OUT" };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json({ msg: "Products sold out", total, products });
}

export const createProduct = async (req, res) => {
    const { name, description, price, stock, status, category } = req.body;
    const product = new Product({ name, description, price, stock, status, category});

    await product.save();
    res.status(201).json({ product });
}

export const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    await Product.findByIdAndUpdate(id, rest);

    const product = await Product.findOne({ _id: id });
    
    res.status(200).json({ msg: 'Product Updated', product });
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, { status: "DELETED" });

    const product = product = await Product.findOne({ _id: id });

    const authenticatedUser = req.user;

    res.status(200).json({ msg: 'Product Deleted', product, authenticatedUser });
}