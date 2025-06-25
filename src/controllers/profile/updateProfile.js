import AppError from "../../utils/AppError.js";
import prisma from "./../../lib/prisma.js";
import { userSelect } from "./../../lib/selects.js";

async function updateProfile(req, res, next) {
  try {
    const { bio, email } = req.body;
    const id = req.user.id;

    let user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: { ...userSelect },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!bio && !email) {
      return next(new AppError("No changes to update", 400));
    }

    user = await prisma.User.update({
      where: { id },
      data: {
        bio: bio ? bio : undefined,
        email: email ? email : undefined,
        isVerified: email ? true : false,
      },
      select: { ...userSelect },
    });

    res.json({
      sucess: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export default updateProfile;
