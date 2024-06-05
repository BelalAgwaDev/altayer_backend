const asyncHandler = require('express-async-handler')
const ApiError = require('../../../utils/apiError/apiError')
const storeModel = require('../../../modules/storeModel')

// @ dec get  store
// @ Depending on the condition of the store, whether it is occupied, open or open
// @ route get  /api/vi/store/:storeId
// @ access protected/User/store owner
exports.getStore = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const store = await storeModel.findById(id)

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
    message: `Sucess to get all stores`,
    data: storeWithStatus,
  })
})
