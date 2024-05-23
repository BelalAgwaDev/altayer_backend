const asyncHandler = require('express-async-handler')
const productModel = require('../../../modules/productModel')
const ApiError = require('../../../utils/apiError/apiError')

// @ dec update product to store
// @ route put  /api/vi/store/product/:productId
// @ access private /StoreOwner/admin

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params
  const product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  })
  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404))
  }

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to update product`,
    data: product,
  })
})
