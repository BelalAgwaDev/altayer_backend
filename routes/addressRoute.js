const express = require("express");
const authServices = require("../services/authServices/protect");
const UserService = require("../services/userServices/UserService");
const {
  creatAddress,
  deleteAddress,
} = require("../services/userAddress/addressService");

const { getAllAddress } = require("../services/userAddress/getAllAddress");
const { updateAddress } = require("../services/userAddress/updateAddress");

const {
  createAddressValidator,
  deleteAddressValidator,

  updateAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(authServices.protect);

router
  .route("/")
  .get(getAllAddress)
  .post(
    createAddressValidator,
    UserService.addLoggedUserDataInBody,
    creatAddress
  );

router
  .route("/:id")
  .delete(deleteAddressValidator, deleteAddress)
  .put(
    updateAddressValidator,
    UserService.addLoggedUserDataInBody,
    updateAddress
  );

module.exports = router;
