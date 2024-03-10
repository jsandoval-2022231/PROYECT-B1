import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteOwnUser,
  updateOwnUser
} from "./user.controller.js";
import { existsEmail, existsUserById, isValidRol } from "../helpers/db-validators.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.get('/', [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    ],getUsers);

router.get(
    '/:id',
    [
        validateJWT,
        hasRole("ADMIN_ROLE"),
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
        validateJWT,
        hasRole("ADMIN_ROLE"),
        check("name", "Name required").not().isEmpty(),
        check("email", "Email required").not().isEmpty(),
        check("email", "Email invalid").isEmail(),
        check('email').custom(existsEmail),
        check("password", "Password required").not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check("role", "Role required").not().isEmpty(),
        check("role").custom(isValidRol),
        validInputs,
    ],
    createUser);

router.post(
    '/owner',
    [
        check("name", "Name required").not().isEmpty(),
        check("email", "Email required").not().isEmpty(),
        check("email", "Email invalid").isEmail(),
        check('email').custom(existsEmail),
        check("password", "Password required").not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        validInputs,
    ], createUser);

router.put(
    '/:id',
    [
        validateJWT,
        hasRole("ADMIN_ROLE"),
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        check('id').custom(existsUserById),
        validInputs
    ],
    updateUser
);

router.put(
    '/',
    [
        validateJWT,
        validInputs,
    ],
    updateOwnUser
);

router.delete(
    '/:id',
    [
        validateJWT,
        hasRole("ADMIN_ROLE"),
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        validInputs,
    ],
    deleteUser
);

router.delete(
    '/',
    [
        validateJWT,
        validInputs,
    ],
    deleteOwnUser
);

export default router;
