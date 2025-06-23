const authService = require("../services/authService");

const signUp = async (req, res) => {
  const { userNme, password } = req.body;