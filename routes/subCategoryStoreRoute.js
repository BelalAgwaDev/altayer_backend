const express = require("express");
const authServices = require("../services/authServices/protect");
const UserService = require("../services/userServices/UserService");
const {
  addSubCategoryToStore,
  getStoreSubCategory,
  removeSubCategoryFromStore,
} = require("../services/storeScervice/subCategoryStore/subCategoryStoreService");

const {
  StoreAddSubCatogryValidator,
} = require("../utils/validators/subCategoryStoreValidator");

const router = express.Router();

router.use(authServices.protect);

router.route("/").post(UserService.addLoggedUserDataInBody, getStoreSubCategory);

router.use(authServices.allowedTo("admin", "storeOwner"));

router
  .route("/")
  .post(UserService.addLoggedUserDataInBody,StoreAddSubCatogryValidator ,addSubCategoryToStore);

router
  .route("/:addressStoreId")
  .delete(UserService.addLoggedUserDataInBody, removeSubCategoryFromStore);

module.exports = router;
