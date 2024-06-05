const asyncHandler = require('express-async-handler')
const storeModel = require('../../../modules/storeModel')

// @ dec get all store
// @ Depending on the condition of the store, whether it is occupied, open or open
// @ route get  /api/vi/store/
// @ access protected/User
exports.getAllStore = asyncHandler(async (req, res, next) => {
  const stores = await storeModel.find()



  const storesWithStatus = stores.map((store) => ({
    ...store.toObject(),
    status: store.storeStatus,  
  }));
  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get all stores`,
    data: storesWithStatus,
  })
})
