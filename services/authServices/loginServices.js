const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../../utils/apiError/apiError");
const userModel = require("../../modules/userModel");
const creatToken = require("../../utils/generate token/createToken");



// @ dec login
// @ route Post  /api/vi/auth/login
// @ access Public
exports.login = asyncHandler(async (req, res, next) => {
  //check if user exist & check if password is correct

  const document = await userModel.findOne({ email: req.body.email });
  if (
    !document ||
    !(await bcrypt.compare(req.body.password, document.password))
  ) {
    return next(new ApiError("Incorrect email or password.", 400));
  }

  //generate token
  const accessToken = creatToken(
    document._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );
  const refreshToken = creatToken(
    document._id,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN
  );

  document.refreshToken = refreshToken;
  await document.save();

  //send success response to client side
  res.status(201).json({
    status: true,
    message: `Successful login into the app for the ${document.role}`,
    accessToken: accessToken,
    data: document,
  });
});