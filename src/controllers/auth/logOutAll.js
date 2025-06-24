import authService from "../../services/authService.js";
import AppError from "../../utils/AppError.js";

async function logOutAll(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Refresh token not found", 401));
    }
    const payload = await authService.verifyRefreshToken(refreshToken);

    await authService.logOutAll(payload.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
}

export default logOutAll;
