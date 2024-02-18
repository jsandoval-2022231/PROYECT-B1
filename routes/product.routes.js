const { Router } = require('express');
const { check } = require('express-validator'); 

const { getProducts } = require('../controller/product.controller');

const router = Router();

router.get('/', getProducts);


module.exports = router;