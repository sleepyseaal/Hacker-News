import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Access token not found", 401));
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    req.user = payload;

    return next();
  } catch (err) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        err.name
      )
    ) {
      return next(new AppError("Access token expired", 401));
    }
    return next(err);
  }
}

export { verifyToken };
