import { Router } from "express";
import { check } from "express-validator";

import { getBill } from "./bill.controller.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/', getBill);

export default router;