const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");

// @ dec create new store
// @ route Post  /api/vi/store/
// @ access protected/StoreOwner
exports.createStore = asyncHandler(async (req, res, next) => {
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
exports.addAddressAndSomeDataToStore = asyncHandler(async (req, res, next) => {
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
