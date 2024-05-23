const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  creatUser,
  getAllUser,
  getOneUser,
  getLoggedUserData,

  deleteUser,

  uploadUserImage,
  resizeUserImage,
} = require("../services/userServices/UserService");

const {
  updateLoggedUserPassword,
} = require("../services/userServices/updateLoggedPassword");

const {
  updateLoggedUserData,
} = require("../services/userServices/updateLoggedUserData");

const {
  updateUserPassword,
} = require("../services/userServices/updatePassword");

const { updateUser } = require("../services/userServices/updateUser");

const {
  updateLoggedUserImage,
} = require("../services/userServices/updateloggetUserImage");
const {
  deleteLoggedUser,
} = require("../services/userServices/deleteLoggedUser");


const {uploadToCloudinary} = require("../middleware/cloudinaryMiddleWare");


const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router.use(authServices.protect);

router.route("/getMe").get(getLoggedUserData, getOneUser);
router
  .route("/updateMyData")
  .put(updateLoggedUserValidator, updateLoggedUserData);
router
  .route("/updateMyImage")
  .put(uploadUserImage, resizeUserImage, updateLoggedUserImage);

router
  .route("/updateMyPassword")
  .put(changeLoggedUserPasswordValidator, updateLoggedUserPassword);
router.route("/deleteMe").delete(deleteLoggedUser);

router.use(authServices.allowedTo("admin"));

router
  .route("/")
  .post(uploadUserImage, resizeUserImage, uploadToCloudinary,createUserValidator, creatUser);

router.route("/").get(getAllUser);

router
  .route("/:id")
  .get(getUserValidator, getOneUser)
  .put(uploadUserImage, resizeUserImage,uploadToCloudinary, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, updateUserPassword);

module.exports = router;
