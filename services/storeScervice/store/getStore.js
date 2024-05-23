const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError/apiError");
const storeModel = require("../../../modules/storeModel");

// @ dec get  store
// @ Depending on the condition of the store, whether it is occupied, open or open
// @ route get  /api/vi/store/:storeId
// @ access protected/User/store owner
exports.getStore = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;

  const store = await storeModel.findById(storeId);

  if (!store) {
    return next(
      new ApiError(`Faild To get store data from this id ${storeId}`, 404)
    );
  }

  let status;
  if (store.isOpen) {
    status = store.storeIsBusy ? "busy" : "open";
  } else {
    status = "close";
  }

  const storeWithStatus = {
    ...store.toObject(),
    status: status,
  };

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get all stores`,
    data: storeWithStatus,
  });
});
