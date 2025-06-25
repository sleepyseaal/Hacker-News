import { Router } from "express";
const router = Router();

import {
  signUp,
  logIn,
  logOutAll,
  logOutDevice,
  refresh,
  forgotPassword,
  resetPassword,
} from "../controllers/auth/index.js";

import {
  validateSignUp,
  validateLogIn,
  validateResetPW,
  validateRequest,
} from "../validators/index.js";

import { verifyToken } from "../middleWares/authMiddleware.js";

router.post("/signup", validateSignUp, validateRequest, signUp);
router.post("/login", validateLogIn, validateRequest, logIn);
router.post("/logout", verifyToken, logOutDevice);
router.post("/logout-all", verifyToken, logOutAll);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  validateResetPW,
  validateRequest,
  resetPassword
);

export default router;
