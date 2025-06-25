import { Router } from "express";
const router = Router();

import {
  signUp,
  logIn,
  logOutAll,
  logOutDevice,
  refresh,
} from "../controllers/auth/index.js";

import { verifyToken } from "../middleWares/authMiddleware.js";

import {
  signUpValidator,
  logInValidator,
} from "../validators/authValidator.js";

import requestValidator from "../validators/requestValidator.js";

router.post("/signup", signUpValidator, requestValidator, signUp);
router.post("/login", logInValidator, requestValidator, logIn);
router.post("/logout", verifyToken, logOutDevice);
router.post("/logout-all", verifyToken, logOutAll);
router.post("/refresh", refresh);

export default router;
