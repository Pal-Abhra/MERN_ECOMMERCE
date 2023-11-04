const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData._id);

  next();
});

// exports.authorizeRoles = async (req, res, next) => {
//   // console.log(req.user.role);
//   console.log(req.body);
//   // if (req.user.role !== "admin") {
//   //   return res
//   //     .status(400)
//   //     .json({ message: "Unauthorized access! Please contact to admin" });
//   // }
//   // next();
// };

//issue found
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    //req.user is null
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
