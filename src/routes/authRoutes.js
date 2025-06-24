import { Router } from "express";
const router = Router();

import { signUp, logIn } from "../controllers/auth/index.js";
import {
  signUpValidator,
  logInValidator,
} from "../validators/authValidator.js";
import requestValidator from "../validators/requestValidator.js";

router.post("/signup", signUpValidator, requestValidator, signUp);
router.post("/login", logInValidator, requestValidator, logIn);

export default router;
