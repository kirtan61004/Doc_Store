/**
 * Centralized error handler.
 * Must be registered LAST in server.js with 4 params: (err, req, res, next)
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error."
      : err.message || "Internal server error.";

  // Log stack in development
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${err.stack}`);
  }

  res.status(statusCode).json({ status: false, message });
}

module.exports = errorHandler;
