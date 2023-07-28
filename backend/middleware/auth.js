import Errorhandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new Errorhandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
  }
  catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};

export { isAuthenticatedUser, authorizeRoles };