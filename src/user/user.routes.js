import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { existsEmail, existsUserById, isValidRol } from "../helpers/db-validators.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT } from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/', getUsers);
router.get(
    '/:id',
    [
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        check('id').custom(existsUserById),
        validInputs,
    ],
    getUserById
);

router.post(
    '/', 
    [
        check("name", "Name required").not().isEmpty(),
        check("email", "Email required").not().isEmpty(),
        check("email", "Email invalid").isEmail(),
        check('email').custom(existsEmail),
        check("password", "Password required").not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('role').custom(isValidRol),
        validInputs,
    ],
    createUser);

router.put(
    '/:id',
    [
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        check('id').custom(existsUserById),
        validInputs
    ],
    updateUser
);

router.delete(
    '/:id',
    [
        validateJWT,
        hasRole("CLIENT_ROLE"),
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        validInputs,
    ],
    deleteUser
);

export default router;
