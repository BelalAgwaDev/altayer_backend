const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Catogry id format"),
  validatorMiddleware,
];

exports.createCatogryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Catogry name required")
    .isLength({ min: 3 })
    .withMessage("too short Catogry name")
    .isLength({ max: 32 })
    .withMessage("too long Catogry name"),

  validatorMiddleware,
];

exports.updateCatogryValidator = [
  check("id").isMongoId().withMessage("Invalid Catogry id format"),
  
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short Catogry name")
    .isLength({ max: 32 })
    .withMessage("too long Catogry name"),

  validatorMiddleware,
];

exports.deleteCatogryValidator = [
  check("id").isMongoId().withMessage("Invalid Catogry id format"),
  validatorMiddleware,
];
