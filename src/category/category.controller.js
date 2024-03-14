import { response, request } from "express";
import Category from './category.model.js';
import Product from '../product/product.model.js';

export const getCategory = async (req = request, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json({ total, categories });
}

export const deleteCategoryAndProduct = async (req, res) => {
    const { id } = req.params;

    await Category.findByIdAndUpdate(id, { status: false });

    const products = await Product.find({ category: id });

    const categoryId = await Category.findOne({ _id: "65f296500b6e56e699e607b1" });

    for (const product of products) {
        await Product.findByIdAndUpdate(product._id, { category: categoryId });
    }

    const category = await Category.findOne({ _id: id });

    res.status(200).json({ msg: 'Category deleted', category });

}

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });

    res.status(200).json({ category });
}

export const createCategory = async (req, res) => {
    const { name, description, status } = req.body;
    const category = new Category({ name, description, status });

    await category.save();
    res.status(201).json({ category });
}

export const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    await Category.findByIdAndUpdate(id, rest);

    const category = await Category.findOne({ _id: id });

    res.status(200).json({ msg: 'Category Updated', category });
}




export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    await Category.findByIdAndUpdate(id, { status: false });

    const category = await Category.findOne({ _id: id });

    const authenticatedUser = req.user;

    res.status(200).json({ msg: 'Category Deleted', category, authenticatedUser });
}
