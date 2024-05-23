const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError/apiError");
const storeModel = require("../../../modules/storeModel");

// @ dec update delivery by store
// @ route put  /api/vi/store/:storeId/deliverBy
// @ access protected/store owner
exports.updateDeliveryBy = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  const { deliveryBy } = req.body;

  const store = await storeModel.findByIdAndUpdate(
    storeId,
    { deliveryBy },
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
    message: `Sucess to update delivery by to store`,
    data: store,
  });
});
