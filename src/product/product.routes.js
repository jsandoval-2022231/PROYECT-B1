import { Router } from 'express';
import { check } from 'express-validator';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsSoldOut } from './product.controller.js';

import { existsUserById, isValidRol } from "../helpers/db-validators.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT } from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/soldOut', getProductsSoldOut);

router.get('/', getProducts);

router.get('/:id', getProductById);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    validInputs
], createProduct);

router.put('/:id', [
    check('id', 'Id required').not().isEmpty(),
    check('id', 'Id invalid').isMongoId(),
    validInputs
], updateProduct);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'Id required').not().isEmpty(),
    check('id', 'Id invalid').isMongoId(),
    validInputs
], deleteProduct);

export default router;