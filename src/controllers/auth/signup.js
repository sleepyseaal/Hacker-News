import authService from "../../services/authService.js";

async function signUp(req, res, next) {
  try {
    const { userName, password } = req.body;

    const user = await authService.createUser(userName, password);

    const accessToken = authService.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = authService.generateRefreshToken({
      id: user.id,
    });

    await authService.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        tokens: { accessToken, refreshToken },
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

export default signUp;
