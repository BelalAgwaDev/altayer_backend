const asyncHandler = require('express-async-handler')
const ApiError = require('../../../utils/apiError/apiError')
const storeModel = require('../../../modules/storeModel')

// @ dec update open, close ,busy[] time store
// @ route put  /api/vi/store/:storeId/timeState
// @ access protected/store owner
exports.updateTimeState = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const { openTime, closeTime, timezone  } = req.body

  const store = await storeModel.findByIdAndUpdate(
    { _id: id },
    { openTime, closeTime, timezone },
    { new: true },
  )

  if (!store) {
    return next(
      new ApiError(`Faild To get store data from this id ${id}`, 404),
    )
  }



  const storeWithStatus = {
    ...store.toObject(),
    status:  store.storeStatus,
  }


  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to update store time`,
    data: storeWithStatus,
  })
})
