import { Router } from "express";
const router = Router();

import { verifyToken } from "../middleWares/index.js";

import {
  validateChangePW,
  validateProfile,
  validateRequest,
} from "../validators/index.js";

import { changePassword, updateProfile } from "../controllers/profile/index.js";

router.post(
  "/change-password",
  validateChangePW,
  validateRequest,
  verifyToken,
  changePassword
);

router.post(
  "/update-profile",
  verifyToken,
  validateProfile,
  validateRequest,
  updateProfile
);

export default router;
