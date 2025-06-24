import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import authService from "../../services/authService.js";
import bcrypt from "bcrypt";

async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return next(new AppError("Refresh token not found", 401));
    }

    const payload = await authService.verifyRefreshToken(refreshToken);

    const tokens = await prisma.refreshToken.findMany({
      where: {
        userId: payload.userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    let validToken = null;
    for (const token of tokens) {
      const isValid = await bcrypt.compare(refreshToken, token.token);
      if (isValid) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      return next(new AppError("Invalid refresh token", 401));
    }

    await prisma.refreshToken.update({
      where: { id: validToken.id },
      data: { revoked: true },
    });

    const newRefreshToken = authService.generateRefreshToken({
      id: payload.id,
    });

    const newAccessToken = authService.generateAccessToken({
      id: payload.id,
      role: payload.role,
    });

    await authService.saveRefreshToken(payload.id, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { token: newAccessToken },
    });
  } catch (err) {
    next(err);
  }
}

export default refresh;
