const Product = require('../models/product');

const productExists = async (id = '') => {
    const product = await Product.findOne(id);
    if (!product) {
        throw new Error(`The product with id ${id} does not exist`);
    }
}

module.exports = {
    productExists
}