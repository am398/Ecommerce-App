import Errorhandler from "../utils/errorHandler.js";

// Path: backend/middleware/error.js

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err instanceof Errorhandler) {
        console.log(err);
        err.message = `Custom Error Occured : ${err.message}`
    }

    if(err.name === "CastError"){
        const message = `Resource not found. Invalid : ${err.path}`;
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