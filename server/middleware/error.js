class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.status = statusCode;
  }
}

export const errMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    success: false,
    message: message,
  });
};

export default ErrorHandler;
