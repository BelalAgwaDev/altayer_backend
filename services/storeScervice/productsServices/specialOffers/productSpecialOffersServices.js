const asyncHandler = require('express-async-handler')

const productModel = require('../../../../modules/productModel')

const factory = require('../../../handleFactor/handlerFactory')
const ApiError = require('../../../../utils/apiError/apiError')


// @ dec update  specialOffers to product
// @ route put  /api/vi/product/:productId/specialOffers/:specialOffersId
// @ access private /StoreOwner/admin
exports.updateProductSpecialOffers = asyncHandler(async (req, res, next) => {
    const { productId, specialOffersId } = req.params
    const { description, discountPercent ,startDate,endDate} = req.body
  
    // Find the product and update the specific choice in the customization option
    const product = await productModel.findOneAndUpdate(
      { _id: productId, 'specialOffers._id': specialOffersId },
   
      {
        $set: {
          'specialOffers.$.description': description,
          'specialOffers.$.discountPercent': discountPercent,
          'specialOffers.$.startDate': Date(startDate) ,
          'specialOffers.$.endDate':  Date(endDate),
        },
      },
      { new: true },
    )
  
  
    // Check if the product was found and updated
    if (!product) {
      return next(
        new ApiError(
          `Failed to find product with ID ${productId} or options with ID ${specialOffersId}`,
          404,
        ),
      )
    }
  
    // Send a success response with the updated product
    res.status(200).json({
      status: true,
      message: `Successfully updated special Offers in product`,
      data: product,
    })
  })
  


  
// @ dec add new specialOffers to product
// @ route Post  /api/vi/product/specialOffers/:id
// @ access private /StoreOwner/admin
exports.addProductSpecialOffers = factory.addOneToList(productModel, 'product special Offers','specialOffers')

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// // @ dec delete specialOffers from product
// // @ route delete  /api/vi/product/specialOffers/:id
// // @ access private /StoreOwner/admin
exports.removeProductSpecialOffers = factory.removeOneFromList(productModel, 'product special Offers','specialOffers')

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec get all specialOffers data from product query
// @ route get  /api/vi/product/specialOffers/:id
// @ access public
exports.getAllProductSpecialOffers = factory.getAllDataFromList(productModel, 'product special Offers','specialOffers')







