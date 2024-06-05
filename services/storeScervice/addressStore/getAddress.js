const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");

// @ dec get all address to store
// @ route get  /api/vi/store/address
// @ access protected/StoreOwner
exports.getStoreAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const document = await storeModel
    .find({_id: id}, 'StoreAddress')
 

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get all address to store`,
    data: document,
  });
});

