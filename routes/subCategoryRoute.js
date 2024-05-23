const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  creatSubCategory,
  getAllSubCategory,
  getOneSubCategory,
  updateSubCategory,
  deleteSubCategory,
  deleteAllSubCategory,
  uploadSubCategoryImage,
  resizeSubCategoryImage,
  setCategoryIdToBody,
  createFilterObject
} = require("../services/subCategoryServices/subCategoryService");

const {
  createSubCatogryValidator,
  getSubCategoryValidator,
  deletesubCatogryValidator,
  updateSubCatogryValidator,
} = require("../utils/validators/subCategoryValidator");



const router = express.Router({mergeParams:true});

router.route("/").get(createFilterObject,getAllSubCategory);

router.route("/:id").get(getSubCategoryValidator, getOneSubCategory);

router.use(authServices.protect, authServices.allowedTo("admin"));

router
  .route("/")
  .post(
    uploadSubCategoryImage,
    resizeSubCategoryImage,
    setCategoryIdToBody,
    createSubCatogryValidator,
    creatSubCategory
  )
  .delete(deleteAllSubCategory);



router
  .route("/:id")
  .put(
    uploadSubCategoryImage,
    resizeSubCategoryImage,
    updateSubCatogryValidator,
    updateSubCategory
  )

  .delete(deletesubCatogryValidator, deleteSubCategory);

module.exports = router;
