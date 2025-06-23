import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";

const authService = {
  async createUser(userName, password) {
    const userExists = await prisma.user.findUnique({
      where: { username: userName },
    });
    if (userExists) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username: userName, password: hashedPassword },
      select: { id: true, username: true, createdAt: true },
    });
    return user;
  },

  generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  },
};

export default authService;
