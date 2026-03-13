// Middleware: Allow only students
function isStudent(req, res, next) {
  if (req.user && req.user.role === "student") return next();
  return res
    .status(403)
    .json({ status: false, message: "Access denied. Students only." });
}

module.exports = isStudent;
