import { Router } from "express";
import { check } from "express-validator";
import { getCategory, getCategoryById, createCategory, updateCategory, deleteCategoryAndProduct } from "./category.controller.js";

import { existsUserById, isValidRol } from "../helpers/db-validators.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/', getCategory);

router.get('/:id', getCategoryById);

router.post('/', 
    [
        validateJWT,
        hasRole('ADMIN_ROLE'),
        check('name', 'Name is required').not().isEmpty(),
        validInputs
    ], 
    createCategory);

router.put('/:id', 
    [
        validateJWT,
        hasRole('ADMIN_ROLE'),
        check('id', 'Id required').not().isEmpty(),
        check('id', 'Id invalid').isMongoId(),
        validInputs
    ], updateCategory);

router.delete('/:id', [
        validateJWT,
        hasRole('ADMIN_ROLE'),
        check('id', 'Id required').not().isEmpty(),
        check('id', 'Id invalid').isMongoId(),
        validInputs
    ], deleteCategoryAndProduct);


export default router;