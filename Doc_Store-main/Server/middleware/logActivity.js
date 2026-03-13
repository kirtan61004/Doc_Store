const ActivityLog = require("../models/ActivityLog");

/**
 * Logs specific routes to ActivityLog.
 * Attach after verifyToken so req.user is available.
 * Usage: router.post("/upload", verifyToken, logActivity("UPLOAD"), ...)
 */
function logActivity(action, getDetails) {
  return async (req, res, next) => {
    try {
      if (req.user) {
        const details = getDetails ? getDetails(req) : "";
        await ActivityLog.create({
          userEmail: req.user.email,
          action,
          details,
          ip: req.ip || "",
        });
      }
    } catch (_) {
      // Never let logging break the request
    }
    next();
  };
}

module.exports = logActivity;
