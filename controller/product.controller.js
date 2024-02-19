const { response, json } = require('express');
const Product = require('../models/product');


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
    postProduct
}