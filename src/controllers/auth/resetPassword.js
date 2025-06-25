import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetToken = await prisma.passwordToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return next(new AppError("Token is invalid or expired", 400));
    }

    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return next(new AppError("New Password is the same as old", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordToken.delete({
      where: { token },
    });

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

export default resetPassword;
