const express = require("express");
const authServices = require("../services/authServiece");
const {
  creatUser,

  getAllUser,
  getOneUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  deleteAllUser,
  uploadUserImage,
  resizeUserImage,
  getLoggedUserData,
  updateLoggedUserImage,
  updateLoggedUserData,
  updateLoggedUserPassword,
  deleteLoggedUser,
} = require("../services/UserService");

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

router
  .route("/")
  .post(
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    creatUser
  );



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
router.route("/").get(getAllUser).delete(deleteAllUser);

router
  .route("/:id")
  .get(getUserValidator, getOneUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, updateUserPassword);

module.exports = router;
