async function changePassword(req, res, next) {
  try {
    const { password } = req.body;
  } catch (err) {
    next(err);
  }
}
