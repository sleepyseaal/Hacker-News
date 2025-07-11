import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

const requestValidator = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return next(new AppError("Validation failed", 422, errors));
  }

  next();
};

export default requestValidator;
