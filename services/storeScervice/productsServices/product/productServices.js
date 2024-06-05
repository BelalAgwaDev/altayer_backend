const {
  uploadToCloudinary,
} = require('../../../../middleware/cloudinaryMiddleWare')

const {
  uploadSingleImage,
} = require('../../../../middleware/imageUploadMiddleware')
const { resizeImage } = require('../../../../middleware/resizeImage')
const productModel = require('../../../../modules/productModel')
const factory = require('../../../handleFactor/handlerFactory')

//upload single image
exports.uploadProductImage = uploadSingleImage('image')

// resize image before upload
exports.resizeProductImage = resizeImage('product')

// upload image in cloud
exports.uploadImageInCloud = uploadToCloudinary()

//passing data to body in create
exports.passingDataToReqBody = (req, res, next) => {
  const {
    
    specialOffersDescription,
    specialOffersDiscountPercent,
    specialOffersStartDate,
    specialOffersEndDate,
    optionName,
    optionAdditionalPrice,
    ingredientsName,
    ingredientsAllergens,
    bulkPricingMinQty,
    bulkPricingDiscountRate,
    customizationOptionsName,
    customizationOptionsChoicesName,
    customizationOptionsChoicesAdditionalPrice,

    ...rest
  } = req.body

  const newSpecialOffers = specialOffersDescription
    ? [
        {
          description: specialOffersDescription,
          discountPercent: specialOffersDiscountPercent,
          startDate: new Date(specialOffersStartDate),
          endDate: new Date(specialOffersEndDate),
        },
      ]
    : []
  const newOptions = optionName
    ? [
        {
          optionName: optionName,
          additionalPrice: optionAdditionalPrice,
        },
      ]
    : []
  const newIngredients = ingredientsName
    ? [
        {
          name: ingredientsName,
          allergens: ingredientsAllergens,
        },
      ]
    : []
  const newBulkPricing = bulkPricingMinQty
    ? [
        {
          minQty: bulkPricingMinQty,
          discountRate: bulkPricingDiscountRate,
        },
      ]
    : []
  const newCustomizationOptions = customizationOptionsName
    ? [
        {
          name: customizationOptionsName,
          choices: customizationOptionsChoicesName
            ? [
                {
                  name: customizationOptionsChoicesName,
                  additionalPrice: customizationOptionsChoicesAdditionalPrice,
                },
              ]
            : [],
        },
      ]
    : []

  req.body = {
    ...rest,
    // ...rest,
    specialOffers: newSpecialOffers,
    options: newOptions,
    ingredients: newIngredients,
    bulkPricing: newBulkPricing,
    customizationOptions: newCustomizationOptions,
  }

  next()
}

// @ dec add new product to store
// @ route Post  /api/vi/store/product
// @ access private /StoreOwner/admin
exports.createNewProduct = factory.creatOne(productModel, 'product')

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// @ dec delete product to store
// @ route delete  /api/vi/store/product/:productId
// @ access private /StoreOwner/admin
exports.deleteProduct = factory.deleteOne(productModel, 'product')

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// @ dec get specific product by id
// @ route get  /api/vi/store/product/:productId
// @ access public
exports.getSpecificProduct = factory.getOne(productModel, 'product')

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// @ dec update product to store
// @ route put  /api/vi/store/product/:productId
// @ access private /StoreOwner/admin
exports.updateProduct = factory.updateOne(productModel, 'product')

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// @ dec get all  product to store
// @ route Get  /api/vi/store/product
// @ access public
exports.getAllProduct = factory.getAllData(productModel, 'product')
