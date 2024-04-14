const express = require("express");
const authServices = require("../services/authServiece");
const {
  creatCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../services/categoryService");

const {
  createCatogryValidator,
  getCategoryValidator,
  updateCatogryValidator,
  deleteCatogryValidator,
} = require("../utils/validators/categoryValidator");


const 
  subCategoryRoute
 = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRoute);

router.route("/").get(getAllCategory);

router.route("/:id").get(getCategoryValidator, getOneCategory);

router.use(authServices.protect, authServices.allowedTo("admin"));




router
  .route("/")
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    createCatogryValidator,
    creatCategory
  )
  .delete(deleteAllCategory);

router
  .route("/:id")
  .put(
    uploadCategoryImage,
    resizeCategoryImage,
    updateCatogryValidator,
    updateCategory
  )

  .delete(deleteCatogryValidator, deleteCategory);

module.exports = router;
