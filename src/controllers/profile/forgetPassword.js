/* import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(new AppError("No account with that email", 404));
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + 1 * 60 * 60 * 1000 // 1 hour
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    res.status(200).json({
      success: true,
      message: "Reset token created",
      data: {
        resetLink: `/reset-password/${token}`, // for dev only
      },
    });
  } catch (err) {
    next(err);
  }
};
 */
