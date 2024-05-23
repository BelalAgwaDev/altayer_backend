const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../../modules/subCategoryModel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");



exports.StoreAddSubCatogryValidator = [


  check("subCategoryId")
    .notEmpty()
    .withMessage("sub Catogry id required")
    .isMongoId()
    .withMessage("Invalid sub Category id format")
    .custom(
      asyncHandler(async (val) => {
        const document = await subCategoryModel.findOne({ _id: val });
        if (!document) {
          throw new Error("this sub Category id not found");
        }
      })
    ),

  validatorMiddleware,
];

