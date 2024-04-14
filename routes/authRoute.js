const express = require("express");
const {
  signUp,
  login,
  forgetPassword,
  verifyCode,
  resetPassword,
  

} = require("../services/authServiece");

const {
  loginValidator,
  signUpValidator,
  restPasswordValidator
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signUp").post(signUpValidator,signUp);

router.route("/login").post(loginValidator,login);

router.route("/forgetPassword").post(forgetPassword);

router.route("/verifyCode").post(verifyCode);

router.route("/resetPassword").put(restPasswordValidator,resetPassword);

module.exports = router;
