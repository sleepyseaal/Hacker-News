import { body } from "express-validator";

export const validateChangePW = [
  body("newPassword")
    .isString()
    .withMessage("New password must be a string")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("New password must be between 6 and 20 characters long")
    .matches(/[A-Z]/)
    .withMessage("New password must contain at least one uppercase letter"),
];

export const validateProfile = [
  body("bio")
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Bio must be between 10 and 200 characters long"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
];
