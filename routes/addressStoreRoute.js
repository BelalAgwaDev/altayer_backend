const express = require("express");
const authServices = require("../services/authServices/protect");
const UserService = require("../services/userServices/UserService");
const {
  addNewAddressToStore,
} = require("../services/storeScervice/addressStore/addAddress");

const {
  getStoreAddress,
} = require("../services/storeScervice/addressStore/getAddress");
const {
  removeAddressFromStore,
} = require("../services/storeScervice/addressStore/removeAddress");



const router = express.Router();

router.use(authServices.protect);

router
.route("/")
.post(
  UserService.addLoggedUserDataInBody,
  getStoreAddress
);


router.use(authServices.allowedTo("admin","storeOwner"));

  
router
.route("/")
.post(
  UserService.addLoggedUserDataInBody,
  addNewAddressToStore
);


router
  .route("/:addressStoreId")
  .delete(  UserService.addLoggedUserDataInBody, removeAddressFromStore)


module.exports = router;
