import authService from "../../services/authService.js";

async function logIn(req, res, next) {
  try {
    const { userName, password } = req.body;
    const user = await authService.logIn(userName, password);
    delete user.password; // Remove password from the response for security

    const accesstoken = authService.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshtoken = authService.generateRefreshToken({
      id: user.id,
    });

    await authService.saveRefreshToken(user.id, refreshtoken);

    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "Strict",
      path: "/api/auth/refresh",
    });

    delete user.password; // Ensure password is not sent in the response

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token: accesstoken,
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

export default logIn;
