const express = require("express");
const authServices = require("../services/authServiece");
const UserService = require("../services/UserService");
const {
  creatAddress,
  deleteAddress,
  deleteAllAddress,
  getAllAddress,
  getOneAddress,
  updateAddress,
} = require("../services/addressService");



const {
  createAddressValidator,
  deleteAddressValidator,
  getAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(authServices.protect);

router
  .route("/")
  .get(getAllAddress)
  .post(createAddressValidator,UserService.addLoggedUserDataInBody, creatAddress)
  .delete(deleteAllAddress);

router
  .route("/:id")
  .get(getAddressValidator, getOneAddress)
  .delete(deleteAddressValidator, deleteAddress)
  .put(updateAddressValidator,UserService.addLoggedUserDataInBody, updateAddress);



module.exports = router;
