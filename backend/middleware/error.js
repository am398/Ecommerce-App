import Errorhandler from "../utils/errorHandler.js";

// Path: backend/middleware/error.js

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new Errorhandler(message, 400);
      }
    
      // Mongoose duplicate key error
      if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new Errorhandler(message, 400);
      }
    
      // Wrong JWT error
      if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new Errorhandler(message, 400);
      }
    
      // JWT EXPIRE error
      if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new Errorhandler(message, 400);
      }
    // Handling mongoose Validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        err = new Errorhandler(message, 400);
    }

    res.status(err.statusCode).json({
        name: err.name,
        success: false,
        message: err.message
    });
}