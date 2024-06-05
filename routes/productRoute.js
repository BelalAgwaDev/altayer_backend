const express = require('express')
const authServices = require('../services/authServices/protect')
const {
  createNewProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getSpecificProduct,
  resizeProductImage,

  uploadImageInCloud,
  uploadProductImage,
  passingDataToReqBody,
} = require('../services/storeScervice/productsServices/product/productServices')

const {
  addProductOption,
  getAllProductOption,
  removeProductOption,
  updateProductOptions,
} = require('../services/storeScervice/productsServices/option/optionProductServices')

const {
  addProductBulkPricing,
  getAllProductBulkPricing,
  removeProductBulkPricing,
  updateProductBulkPricing,
} = require('../services/storeScervice/productsServices/bulkPricing/bulkPricingProductServices')

const {
  addProductSpecialOffers,
  getAllProductSpecialOffers,
  removeProductSpecialOffers,
  updateProductSpecialOffers,
} = require('../services/storeScervice/productsServices/specialOffers/productSpecialOffersServices')

const {
  addProductIngredients,
  getAllProductIngredients,
  removeProductIngredients,
  updateProductIngredients,
} = require('../services/storeScervice/productsServices/ingredients/ingredientsProductServices')

const {
  addProductCustomizationOptions,
  getAllProductCustomizationOptions,
  removeProductCustomizationOptions,
  updateProductCustomizationOptions,
} = require('../services/storeScervice/productsServices/customizationOptions/productCustomizationOptionsServices')

const router = express.Router()

router.use(authServices.protect)

router.route('/').get(getAllProduct)
router.route('/:id').get(getSpecificProduct)

router.use(authServices.allowedTo('admin', 'storeOwner'))

router.route('/:id/option').post(addProductOption)

router.route('/:id/option').delete(removeProductOption)

router.route('/:id/option').get(getAllProductOption)
router.route('/:productId/option/:optionsId').put(updateProductOptions)

router.route('/:id/ingredients').post(addProductIngredients)

router.route('/:id/ingredients').delete(removeProductIngredients)

router.route('/:id/ingredients').get(getAllProductIngredients)
router
  .route('/:productId/ingredients/:ingredientsId')
  .put(updateProductIngredients)

router.route('/:id/bulkPricing').post(addProductBulkPricing)

router
  .route('/:productId/bulkPricing/:bulkPricingId')
  .put(updateProductBulkPricing)

router.route('/:id/bulkPricing').delete(removeProductBulkPricing)

router.route('/:id/bulkPricing').get(getAllProductBulkPricing)

router.route('/:id/specialOffers').post(addProductSpecialOffers)

router.route('/:id/specialOffers').delete(removeProductSpecialOffers)

router.route('/:id/specialOffers').get(getAllProductSpecialOffers)
router
  .route('/:productId/specialOffers/:specialOffersId')
  .put(updateProductSpecialOffers)

router.route('/:id/customizationOptions').post(addProductCustomizationOptions)

router
  .route('/:id/customizationOptions')
  .delete(removeProductCustomizationOptions)

router.route('/:id/customizationOptions').get(getAllProductCustomizationOptions)

router
  .route('/:productId/customization-options/:optionId/choices/:choiceId')
  .put(updateProductCustomizationOptions)

router
  .route('/')
  .post(
    uploadProductImage,
    resizeProductImage,
    uploadImageInCloud,
    passingDataToReqBody,
    createNewProduct,
  )
router
  .route('/:id')
  .put(
    uploadProductImage,
    resizeProductImage,
    uploadImageInCloud,
    passingDataToReqBody,
    updateProduct,
  )
  .delete(deleteProduct)

module.exports = router
