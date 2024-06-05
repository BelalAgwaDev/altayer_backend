const asyncHandler = require('express-async-handler')
const ApiError = require('../../../utils/apiError/apiError')
const storeModel = require('../../../modules/storeModel')

// @ dec update delivery by store
// @ route put  /api/vi/store/:storeId/deliverBy
// @ access protected/store owner
exports.updateDeliveryBy = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const { deliveryBy } = req.body

  const store = await storeModel.findByIdAndUpdate(
    { _id: id },
    { deliveryBy },
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
    message: `Sucess to update delivery by to store`,
    data: storeWithStatus,
  })
})
