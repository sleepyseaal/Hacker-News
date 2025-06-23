import authService from "../../services/authService.js";

async function signUp(req, res, next) {
  try {
    const { userName, password } = req.body;

    const user = await authService.createUser(userName, password);

    const accessToken = authService.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        tokens: { accessToken },
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

export default signUp;
