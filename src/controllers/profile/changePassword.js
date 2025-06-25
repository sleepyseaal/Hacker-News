import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import { userSelect } from "../../lib/selects.js";
import AppError from "../../utils/AppError.js";

async function changePassword(req, res, next) {
  try {
    const { id } = req.user;
    const newPassword = req.body.newPassword;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { ...userSelect, password: true },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const isSamePassword = await bcrypt.compare(user.password, newPassword);

    if (isSamePassword) {
      return next(new AppError("New password is the same as the old one", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    delete user.password;

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export default changePassword;
