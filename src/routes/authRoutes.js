import { Router } from "express";
const router = Router();

import { signUp } from "../controllers/auth/index.js";
import { signUpValidator } from "../validators/authValidator.js";
import requestValidator from "../validators/requestValidator.js";

router.post("/signup", signUpValidator, requestValidator, signUp);

export default router;
