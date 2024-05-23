const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");

// @ dec get all address to store
// @ route get  /api/vi/store/address
// @ access protected/StoreOwner
exports.getStoreAddress = asyncHandler(async (req, res, next) => {
  const document = await storeModel
    .findById({ user: req.userModel._id })
    .populate("StoreAddress");

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get all address to store`,
    data: document,
  });
});

