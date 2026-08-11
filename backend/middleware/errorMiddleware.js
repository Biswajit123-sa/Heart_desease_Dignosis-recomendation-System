// middleware/errorMiddleware.js
// Catches any error thrown in a route and returns a consistent JSON response
// instead of crashing the server or leaking a stack trace to the client.

const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err.stack);

  res.status(statusCode || 500).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
