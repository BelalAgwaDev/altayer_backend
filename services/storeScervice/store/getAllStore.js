const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");




// @ dec get all store
// @ Depending on the condition of the store, whether it is occupied, open or open
// @ route get  /api/vi/store/
// @ access protected/User
exports. getAllStore = asyncHandler(async (req, res, next) => {
    const stores = await storeModel.find();
  
    const storesWithStatus = stores.map((store) => {
      let status;
      if (store.isOpen) {
        status = store.storeIsBusy ? "busy" : "open";
      } else {
        status = "close";
      }
  
      return {
        ...store.toObject(),
        status: status,
      };
    });
  
    //send success response
    res.status(201).json({
      status: true,
      message: `Sucess to get all stores`,
      data: storesWithStatus,
    });
  });
  