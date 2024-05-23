const asyncHandler = require('express-async-handler')
const productModel = require('../../../modules/productModel')
const ApiError = require('../../../utils/apiError/apiError')

// @ dec get specific product by id
// @ route get  /api/vi/store/product/:productId
// @ access public

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const product = await productModel.findById(id)

  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404))
  }

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get specific products`,
    data: product,
  })
})
