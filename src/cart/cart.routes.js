import { Router } from "express";
import { check } from "express-validator";
import { createCart, getCart } from "./cart.controller.js";

import { existsUserById, isValidRol } from "../helpers/db-validators.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/', validateJWT, getCart);

router.post('/', 
    [
        validateJWT,
        hasRole('CLIENT_ROLE'),
        check('products', 'Products are required').isArray(),
        validInputs
    ], 
    createCart);


export default router;