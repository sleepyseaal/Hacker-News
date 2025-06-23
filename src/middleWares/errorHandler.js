import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const isOperational = err.isOperational || false;

  const message = isProduction
    ? isOperational
      ? err.message
      : "Internal Server Error"
    : err.message;

  const response = {
    success: false,
    message,
    data: err.data || null,
  };

  res.status(statusCode).json(response);
};

const notFound = (req, res, next) => {
  next(new AppError("API endpoint not found", 404));
};

export { errorHandler, notFound };
