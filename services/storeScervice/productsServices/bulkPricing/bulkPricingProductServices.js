const asyncHandler = require('express-async-handler')

const productModel = require('../../../../modules/productModel')

const factory = require('../../../handleFactor/handlerFactory')
const ApiError = require('../../../../utils/apiError/apiError')


// @ dec update  bulkPricing to product
// @ route put  /api/vi/product/bulkPricing/:productId/bulkPricing/:bulkPricingId
// @ access private /StoreOwner/admin
exports.updateProductBulkPricing = asyncHandler(async (req, res, next) => {
  const { productId, bulkPricingId } = req.params
  const { minQty, discountRate } = req.body

  // Find the product and update the specific choice in the customization option
  const product = await productModel.findOneAndUpdate(
    { _id: productId, 'bulkPricing._id': bulkPricingId },
 
    {
      $set: {
        'bulkPricing.$.minQty': minQty,
        'bulkPricing.$.discountRate': discountRate,
      },
    },
    { new: true },
  )


  // Check if the product was found and updated
  if (!product) {
    return next(
      new ApiError(
        `Failed to find product with ID ${productId} or bulk Pricing with ID ${bulkPricingId}`,
        404,
      ),
    )
  }

  // Send a success response with the updated product
  res.status(200).json({
    status: true,
    message: `Successfully updated bulPricingId in product`,
    data: product,
  })
})

// @ dec add new bulkPricing to product
// @ route Post  /api/vi/product/bulkPricing/:id
// @ access private /StoreOwner/admin
exports.addProductBulkPricing = factory.addOneToList(
  productModel,
  'product bulk Pricing',
  'bulkPricing',
)

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// // @ dec delete bulkPricing from product
// // @ route delete  /api/vi/product/bulkPricing/:id
// // @ access private /StoreOwner/admin
exports.removeProductBulkPricing = factory.removeOneFromList(
  productModel,
  'product bulk Pricing',
  'bulkPricing',
)

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec get all bulkPricing data from product query
// @ route get  /api/vi/product/bulkPricing/:id
// @ access public
exports.getAllProductBulkPricing = factory.getAllDataFromList(
  productModel,
  'product bulk Pricing',
  'bulkPricing',
)
