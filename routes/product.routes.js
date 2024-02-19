const { Router } = require('express');
const { check } = require('express-validator'); 

const { getProducts, postProduct } = require('../controller/product.controller');

const router = Router();

router.get('/', getProducts);

router.post('/', [
    check('name', 'The name is required').not().isEmpty(),
], postProduct);


module.exports = router;