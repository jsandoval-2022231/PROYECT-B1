import { Router } from "express";
import { check } from "express-validator";
import { createUser } from './user.controller.js'

const router = Router();

router.post('/', 
    [
        check('name', 'Name required').not().isEmpty()
    ], 
    createUser);


export default router;