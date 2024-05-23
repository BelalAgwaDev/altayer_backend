const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError/apiError");
const storeModel = require("../../../modules/storeModel");

// @ dec update  store data
// @ route put  /api/vi/store/:storeId
// @ access protected/store owner
exports.updateStore = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  const {
    StoreName,
    StoreDescription,
    deliveryTime,
    minimumPurchases,
    deliveryCharge,
    preOrder,
    legalStoreName,
  } = req.body;

  const store = await storeModel.findByIdAndUpdate(
    storeId,
    {
      StoreName,
      StoreDescription,
      deliveryTime,
      minimumPurchases,
      deliveryCharge,
      preOrder,
      legalStoreName,
    },
    { new: true }
  );

  if (!store) {
    return next(
      new ApiError(`Faild To get store data from this id ${storeId}`, 404)
    );
  }

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to update store data`,
    data: store,
  });
});


