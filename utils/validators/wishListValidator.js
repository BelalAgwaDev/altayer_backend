const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const productModel = require('../../modules/productModel')
const storeModel = require('../../modules/storeModel')

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
]

exports.creatWishListValidator = [
  check('product')
    .optional()
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom((val, { req }) =>
      //check if logged user create review before

      productModel.findById({ _id: req.body.product }).then((product) => {
        if (!product) {
          return Promise.reject(
            new Error('Faild To get data from this product id '),
          )
        }
      }),
    ),

  check('store')
    .optional()
    .isMongoId()
    .withMessage('Invalid store id format')
    .custom((val, { req }) =>
      //check if logged user create review before

      storeModel.findById({ _id: req.body.store }).then((store) => {
        if (!store) {
          return Promise.reject(
            new Error('Faild To get data from this store id'),
          )
        }
      }),
    ),

  validatorMiddleware,
]

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      //check review owership before update
      productModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`))
        }

        if (review.user._id.toString() !== req.body.user.toString()) {
          return Promise.reject(
            new Error(`you are not allowed to perform this action`),
          )
        }
      }),
    ),

  validatorMiddleware,
]

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) => {
      //check review ownership before update
      if (req.userModel.role === 'user') {
        return productModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error('there is no review with id'))
          }

          if (review.user._id.toString() !== req.body.user.toString()) {
            return Promise.reject(
              new Error('your are not allowed to perform this action'),
            )
          }
        })
      }
      return true
    }),
  validatorMiddleware,
]
