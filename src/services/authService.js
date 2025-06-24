import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { userSelect } from "../lib/selects.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const authService = {
  async createUser(userName, password) {
    const userExists = await prisma.user.findUnique({
      where: { username: userName },
      select: { ...userSelect },
    });
    if (userExists) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username: userName, password: hashedPassword },
      select: { ...userSelect },
    });
    return user;
  },

  async logIn(userName, password) {
    const user = await prisma.user.findUnique({
      where: { username: userName },
      select: { ...userSelect, password: true },
    });

    if (!user) {
      throw new AppError("Incorrect username or password", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Incorrect username or password", 401);
    }

    return user;
  },

  async logoutDevice(userId, refreshToken) {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    let validToken = null;
    for (const token of tokens) {
      const isValid = await bcrypt.compare(refreshToken, token.hashedToken);
      if (isValid) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    await prisma.refreshToken.update({
      where: { id: validToken.id },
      data: { revoked: true },
    });
  },

  async logOutAll(userId) {
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  },

  generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  },

  generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
  },

  async saveRefreshToken(userId, refreshToken) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await prisma.refreshToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
  },

  async verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET);

      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          userId: payload.id,
          expiresAt: { gt: new Date() },
          revoked: false,
        },
      });

      if (!storedToken) {
        throw new AppError("Refresh token not found", 401);
      }

      const isValidToken = await bcrypt.compare(token, storedToken.token);
      if (!isValidToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      return payload;
    } catch (err) {
      throw new AppError("Invalid refresh token", 401);
    }
  },
};

export default authService;
