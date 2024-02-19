const { response, json } = require('express');
const Product = require('../models/product');


const putProduct = async (req, res ) => {
    const { id } = req.params;
    const { _id, name } = req.body;
    await Product.findByIdAndUpdate(id, name);

    const product = await Product.findOne({_id: id});

    res.status(200).json({
        msg: 'Product updated',
        product
    });
}

const getProducts = async (req, res = response) => {
    const { limit, from} = req.query;
    const query = { state: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(from))
            .limit(Number(limit)) ]);
    
    res.status(200).json({
        total,
        products
    });
}

const getProductById = async (req, res ) => {
    const { id } = req.params;
    const product = await Product.findOne({_id: id});
    
    res.status(200).json({
        product
    });
}

const deleteProduct = async (req, res ) => {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, { state: false });

    const product = await Product.findOne({_id: id});

    res.status(200).json({
        msg: 'Product deleted',
        product
    });
}

const postProduct = async (req, res ) => {
    const { name, price, category, description, available } = req.body;
    const product = new Product({ name, price, category, description, available });
    
    
    await product.save();
    res.status(201).json({
        product
    });


}

module.exports = {
    getProducts,
    postProduct, 
    deleteProduct,
    getProductById,
    putProduct
}