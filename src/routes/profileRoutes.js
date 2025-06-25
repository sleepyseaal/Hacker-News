import { Router } from "express";
const router = Router();

import { changePassword } from "../controllers/profile/index.js";
import { verifyToken } from "../middleWares/authMiddleware.js";
import { changePasswordValidator } from "../validators/profileValidator.js";
import requestValidator from "../validators/requestValidator.js";

router.post(
  "/change-password",
  changePasswordValidator,
  requestValidator,
  verifyToken,
  changePassword
);

export default router;
