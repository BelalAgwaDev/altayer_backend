const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError/apiError");
const userModel = require("../modules/userModel");
const sendEmail = require("../utils/sendEmail/sendEmail");
const creatToken = require("../utils/generate token/createToken");

// @ dec sign Up 
// @ route Post  /api/vi/auth/signUp
// @ access Public
const signUp = asyncHandler(async (req, res, next) => {
  // create user
  const document = await userModel.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
   
  });

  //generate token
  const token = creatToken(document._id);

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess Create user`,
    token: token,
    data: document,
  });
});



// // @ dec sign Up as aDriver Or Store Owner
// // @ route Post  /api/vi/auth/signUp
// // @ access Public
// const signUpAsADriverOrStoreOwner = asyncHandler(async (req, res, next) => {
//   // create user
//   const document = await userModel.create({
//     name: req.body.name,
//     phone: req.body.phone,
//     email: req.body.email,
//     password: req.body.password,
//     role: req.body.role
//   });

//   //generate token
//   const token = creatToken(document._id);

//   //send success response
//   res.status(201).json({
//     status: true,
//     message: `Sucess Create user`,
//     token: token,
//     data: document,
//   });
// });



// @ dec login
// @ route Post  /api/vi/auth/login
// @ access Public
const login = asyncHandler(async (req, res, next) => {
  //check if user exist & check if password is correct

  const document = await userModel.findOne({ email: req.body.email });
  if (
    !document ||
    !(await bcrypt.compare(req.body.password, document.password))
  ) {
    return next(new ApiError("Incorrect email or password.", 422));
  }

  //generate token
  const token = creatToken(document._id);

  //send success response to client side
  res.status(201).json({
    status: true,
    message: `Successful login into the app for the ${document.role}`,
    token: token,
    data: document,
  });
});

// @ dec forget password
// @ route Post  /api/vi/auth/forgetPassword
// @ access Public
const forgetPassword = asyncHandler(async (req, res, next) => {
  //get user by email
  const document = await userModel.findOne({ email: req.body.email });

  if (!document) {
    return next(
      new ApiError(`No user has this email ${req.body.email}`, 422)
    );
  }

  // if user exist ,generate hash random 6 digits and save it in db
  const restCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashRestCode = crypto
    .createHash("sha256")
    .update(restCode)
    .digest("hex");

  //save hashed password reset code into db
  document.passwordRestCode = hashRestCode;
  //add expiration time for password rest code (10 min)
  document.passwordRestExpire = Date.now() + 10 * 60 * 1000;
  document.passwordRestVerified = false;

  await document.save();

  const message = `

  Hello ${document.name},

  Click on this icon to complete the password reset.
  
  ${restCode}

  If you did not request this PIN, we recommend that you change your password on super Market App.
  
  Go to Settings & privacy > Sign-in & security > Change password
  
  Your account must be more secure, and you must also:
  
  A common technique in two-step verification
  
  Settings & privacy > Sign in & security > Two-step verification
  
  Check the site you're signed in from
  
  Settings & privacy > Sign in & security > Where you're signed in
  
  Thank you for helping us and the security of your account.
  
  super Market App Team
 
  `;

  // send the reset code via email
  try {
    sendEmail({
      to: document.email,
      subject: `${document.name}, this is your ID code ${restCode}`,
      text: message,
    });
  } catch (error) {
    document.passwordRestCode = undefined;
    document.passwordRestExpire = undefined;
    document.passwordRestVerified = undefined;

    await document.save();
    return next(new ApiError("There was an error sending the email", 422));
  }

  //send success response to client side
  res.status(201).json({
    status: true,
    message: `send rest code to email`,
  });
});

// @ dec verify Reset Code
// @ route Post  /api/vi/auth/verifyCode
// @ access Public
const verifyCode = asyncHandler(async (req, res, next) => {
  //get user based on  rest code
  const hashRestCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");

  //get user by password Rest Code and password Rest Expire
  const document = await userModel.findOne({
    passwordRestCode: hashRestCode,
    passwordRestExpire: { $gt: Date.now() },
  });

  if (!document) {
    return next(new ApiError(`the rest code is invalid or expired`, 422));
  }

  // reset code valid
  document.passwordRestVerified = true;
  await document.save();

  //send success response to client side
  res.status(201).json({
    status: true,
    message: `The account has been verified successfully`,
  });
});

// @ dec  Reset password
// @ route Post  /api/vi/auth/resetPassword
// @ access Public
const resetPassword = asyncHandler(async (req, res, next) => {
  //get user based on  email
  const document = await userModel.findOne({
    email: req.body.email,
  });

  if (!document) {
    return next(
      new ApiError(`No user has this email ${req.body.email}`, 422)
    );
  }

  //check if rest code verified
  if (!document.passwordRestVerified) {
    return next(new ApiError(`Rest code not verified`, 422));
  }

  // update password
  document.password = req.body.newPassword;
  document.passwordRestCode = undefined;
  document.passwordRestExpire = undefined;
  document.passwordRestVerified = undefined;
  await document.save();

  // if everyThing is ok  generate token
  const token = creatToken(document._id);

  //send success response to client side
  res.status(201).json({
    status: true,
    message: `Successfully updating the password to the account`,
    token: token,
    data: document,
  });
});

// @ dec access protect(user , admin  or driver)
// make sure the user is logged in
const protect = asyncHandler(async (req, res, next) => {
  //check if token exist , if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not logged in, please log in to access this route",
        422
      )
    );
  }

  // verify token (no change happnes ,expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //check  if user exists
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user belonging to this token no longer exists",
        422
      )
    );
  }

  //check user active or no
  if (currentUser.active === false) {
    return next(
      new ApiError(
        "This account is inactive, please go to the activated account with login",
        422
      )
    );
  }
  // check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    // password changed after token created (error)
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "The user recently changed his password, please log in again....",
          422
        )
      );
    }
  }

  //using in allowed permision
  req.userModel = currentUser;
  next();
});

// @ dec this fuction check role to user and access allowed data or no
const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //access roles
    //access register user
    //check roles equal role with user
    if (!roles.includes(req.userModel.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 422)
      );
    }

    next();
  });

module.exports = {
  signUp,
  forgetPassword,
  login,
  protect,
  allowedTo,
  verifyCode,
  resetPassword,

};
