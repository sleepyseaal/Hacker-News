import authService from "../../services/authService.js";
import AppError from "../../utils/AppError.js";

async function logOutDevice(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Refresh token not found", 401));
    }
    const payload = await authService.verifyRefreshToken(refreshToken);
    const userId = payload.id;

    await authService.logOutDevice(userId, refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/auth/refresh",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
}

export default logOutDevice;
