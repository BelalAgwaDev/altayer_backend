const asyncHandler = require('express-async-handler')

const productModel = require('../../../../modules/productModel')

const factory = require('../../../handleFactor/handlerFactory')
const ApiError = require('../../../../utils/apiError/apiError')



// @ dec update  ingredients to product
// @ route put  /api/vi/product/:productId/ingredients/:ingredientsId
// @ access private /StoreOwner/admin
exports.updateProductIngredients = asyncHandler(async (req, res, next) => {
    const { productId, ingredientsId } = req.params
    const { name, allergens } = req.body
  
    // Find the product and update the specific choice in the customization option
    const product = await productModel.findOneAndUpdate(
      { _id: productId, 'ingredients._id': ingredientsId },
   
      {
        $set: {
          'ingredients.$.name': name,
          'ingredients.$.allergens': allergens,
        },
      },
      { new: true },
    )
  
  
    // Check if the product was found and updated
    if (!product) {
      return next(
        new ApiError(
          `Failed to find product with ID ${productId} or ingredients with ID ${ingredientsId}`,
          404,
        ),
      )
    }
  
    // Send a success response with the updated product
    res.status(200).json({
      status: true,
      message: `Successfully updated ingredients in product`,
      data: product,
    })
  })
  
// @ dec add new ingredients to product
// @ route Post  /api/vi/product/ingredients/:id
// @ access private /StoreOwner/admin
exports.addProductIngredients = factory.addOneToList(productModel, 'product Ingredients','ingredients')

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////
// // @ dec delete ingredients from product
// // @ route delete  /api/vi/product/ingredients/:id
// // @ access private /StoreOwner/admin
exports.removeProductIngredients = factory.removeOneFromList(productModel, 'product Ingredients','ingredients')

// ////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////

// @ dec get all ingredients data from product query
// @ route get  /api/vi/product/ingredients/:id
// @ access public
exports.getAllProductIngredients = factory.getAllDataFromList(productModel, 'product Ingredients','ingredients')







