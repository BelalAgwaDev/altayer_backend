const asyncHandler = require('express-async-handler')
const productModel = require('../../../modules/productModel')

// @ dec add new product to store
// @ route Post  /api/vi/store/product
// @ access private /StoreOwner/admin

exports.createNewProduct = asyncHandler(async (req, res, next) => {
  const document = await productModel.create(req.body);

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to create products`,
    data: document,
  })
})
