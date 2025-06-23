import { body } from "express-validator";

export const signUpValidator = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters long")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username can only contain letters and numbers"),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
];
