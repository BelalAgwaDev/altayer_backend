const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError/apiError");
const storeModel = require("../../../modules/storeModel");

// @ dec update store state  busy ,open ,close
// @ route put  /api/vi/store/:storeId/state
// @ access protected/User/store owner
exports.updateStoreState = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  const { isOpen, isBusy, isBusyManual } = req.body;

  const store = await storeModel.findByIdAndUpdate(
    storeId,
    { $set: { isOpen, isBusy, isBusyManual } },
    { new: true }
  );

  if (!store) {
    return next(
      new ApiError(`Faild To get store data from this id ${storeId}`, 404)
    );
  }

  let status = "close";
  if (store.isOpen) {
    status = store.isBusy ? "busy" : "open";
  }

  //send success response
  res.status(201).json({
    status: status,
    message: `Sucess to update states`,
    data: { ...store.toObject() },
  });
});
