const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError/apiError");
const storeModel = require("../../modules/storeModel");





// @ dec create new store
// @ route Post  /api/vi/store/
// @ access protected/StoreOwner
const createStore = asyncHandler(async (req, res, next) => {
  // create user
  const document = await storeModel.create({
    StoreName: req.body.StoreName,
    StoreDescription: req.body.StoreDescription,
    legalStoreName: req.body.legalStoreName,
    storeLogoImage: req.body.storeLogoImage,
    storeCoverImage: req.bodystoreCoverImage,
    category: req.body.category,
    user: req.userModel._id,
  });

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to Create store`,
    data: document,
  });
});





// @ dec create new store
// @ route post  /api/vi/store/continueCreation
// @ access protected/StoreOwner
const addAddressAndSomeDataToStore = asyncHandler(async (req, res, next) => {
  // create user
  const document = await storeModel.findOneAndUpdate(
    { user: req.userModel._id },
    {
      $addToSet: {
        StoreAddress: {
          StoreAddressFromMap: req.body.StoreAddressFromMap,
          storeRegion: req.body.storeRegion,
        },
      },
      deliveryTime: req.body.deliveryTime,

      openTime: req.body.storeTimeOpen,

      closeTime: req.body.storeTimeClose,
      minimumPurchases: req.body.minimumPurchases,
      deliveryCharge: req.body.deliveryCharge,
      preOrder: req.body.preOrder,
    },
    {
      new: true,
    }
  );

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to add address to store`,
    data: document,
  });
});




// @ dec get all store
// @ Depending on the condition of the store, whether it is occupied, open or open
// @ route get  /api/vi/store/
// @ access protected/User
const getAllStore = asyncHandler(async (req, res, next) => {
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




// @ dec get  store
// @ Depending on the condition of the store, whether it is occupied, open or open
// @ route get  /api/vi/store/:storeId
// @ access protected/User/store owner
const getStore = asyncHandler(async (req, res, next) => {
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




// @ dec update store state  busy ,open ,close
// @ route put  /api/vi/store/:storeId/state
// @ access protected/User/store owner
const updateStoreState = asyncHandler(async (req, res, next) => {
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




// @ dec update open, close ,busy[] time store
// @ route put  /api/vi/store/:storeId/timeState
// @ access protected/store owner
const updateTimeState = asyncHandler(async (req, res, next) => {
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




// @ dec update delivery by store
// @ route put  /api/vi/store/:storeId/deliverBy
// @ access protected/store owner
const updateDeliveryBy = asyncHandler(async (req, res, next) => {
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




// @ dec update  store data
// @ route put  /api/vi/store/:storeId
// @ access protected/store owner
const updateStore = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  const {
    StoreName,
    StoreDescription,
    deliveryTime,
    minimumPurchases,
    deliveryCharge,
    preOrder,
    legalStoreName,
  } = req.body;

  const store = await storeModel.findByIdAndUpdate(
    storeId,
    {
      StoreName,
      StoreDescription,
      deliveryTime,
      minimumPurchases,
      deliveryCharge,
      preOrder,
      legalStoreName,
    },
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
    message: `Sucess to update store data`,
    data: store,
  });
});





module.exports = {
  createStore,
  addAddressAndSomeDataToStore,
  getAllStore,
  getStore,
  updateStoreState,
  updateTimeState,
  updateDeliveryBy,
  updateStore,
};
