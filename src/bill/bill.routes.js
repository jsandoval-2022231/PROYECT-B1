import { Router } from "express";
import { check } from "express-validator";

import { getBill, getBillByCustomer, payBill, createBill, getBillsByCustomer, getProductSeller } from "./bill.controller.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/', getBill);

router.get('/seller', getProductSeller);

router.get('/mybills', [
    validateJWT,
    validInputs
], getBillsByCustomer);

router.post('/', [
    validateJWT,
    validInputs,
    ], createBill);

router.put('/:id', payBill);

router.get('/:id', getBillByCustomer);

export default router;