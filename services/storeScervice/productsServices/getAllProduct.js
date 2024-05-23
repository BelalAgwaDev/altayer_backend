const asyncHandler = require('express-async-handler')
const productModel = require('../../../modules/productModel')

// @ dec get all  product to store
// @ route Get  /api/vi/store/product
// @ access public

exports.getAllProduct = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 5
  const skip = (page - 1) * limit

  const products = await productModel.find({}).skip(skip).limit(limit)

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get all products`,
    results: products.length,
    page,
    data: products,
  })
})
