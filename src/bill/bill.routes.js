import { Router } from "express";
import { check } from "express-validator";

import { getBill, getBillByCustomer, payBill, createBillWithCart } from "./bill.controller.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/', getBill);

router.post('/', [
    validateJWT,
    validInputs,
    ], createBillWithCart);

// router.put('/:id', payBill);

// router.get('/:id', getBillByCustomer);

export default router;