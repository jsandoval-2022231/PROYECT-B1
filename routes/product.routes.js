const { Router } = require('express');
const { check } = require('express-validator'); 

const { validInputs } = require('../middlewares/valid-input');
const { productExists } = require('../helpers/db-validators');
const { getProducts, postProduct, deleteProduct, getProductById, putProduct} = require('../controller/product.controller');

const router = Router();

router.get('/', getProducts);

router.post('/', [
    check('name', 'The name is required').not().isEmpty(),
], postProduct);

router.delete('/:id', 
    [ 
        check('id', 'Invalid ID').isMongoId()
    ]
    ,deleteProduct);

router.get('/:id', 
    [ 
        check('id', 'Invalid ID').isMongoId()
    ]
    ,getProductById);

router.put('/:id', 
    [
        check('id', 'Invalid ID').isMongoId()
        //check('id').custom(productExists),
        //validInputs
    ],
    putProduct);

    
module.exports = router;