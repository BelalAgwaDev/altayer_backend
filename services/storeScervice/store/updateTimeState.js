const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError/apiError");
const storeModel = require("../../../modules/storeModel");

// @ dec update open, close ,busy[] time store
// @ route put  /api/vi/store/:storeId/timeState
// @ access protected/store owner
exports.updateTimeState = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  const { openTime, closeTime, timezone, busyHours } = req.body;

  const store = await storeModel.findByIdAndUpdate(
    storeId,
    { openTime, closeTime, timezone, busyHours },
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
    message: `Sucess to update store time`,
    data: store,
  });
});
