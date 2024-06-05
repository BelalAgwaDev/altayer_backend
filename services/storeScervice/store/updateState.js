const asyncHandler = require('express-async-handler')
const ApiError = require('../../../utils/apiError/apiError')
const storeModel = require('../../../modules/storeModel')

// @ dec update store state  busy ,open ,close
// @ route put  /api/vi/store/:storeId/state
// @ access protected/User/store owner


exports.updateStoreState = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { manuallySetStatus } = req.body;


  const store = await storeModel.findByIdAndUpdate(
    { _id: id },
    { $set: {manuallySetStatus :manuallySetStatus}},
    { new: true }
  );

  if (!store) {
    return next(new ApiError(`Failed To get store data from this id ${id}`, 404));
  }


  const storeWithStatus = {
    ...store.toObject(),
    status:  store.storeStatus,
  }

  res.status(201).json({
    message: `Success to update states`,
    data: storeWithStatus
  });
});