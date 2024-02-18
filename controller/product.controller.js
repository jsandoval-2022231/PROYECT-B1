const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
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

module.exports = {
    getProducts
}