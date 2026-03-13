// Middleware: Allow only faculty
function isFaculty(req, res, next) {
  if (req.user && (req.user.role === "faculty" || req.user.role === "admin"))
    return next();
  return res
    .status(403)
    .json({ status: false, message: "Access denied. Faculty only." });
}

module.exports = isFaculty;
