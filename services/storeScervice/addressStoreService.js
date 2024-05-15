const asyncHandler = require("express-async-handler");
const storeModel = require("../../modules/storeModel");




// @ dec remove address to store
// @ route delete  /api/vi/store/address/:addressId
// @ access protected/StoreOwner

const removeAddressFromStore = asyncHandler(async (req, res, next) => {
  const document = await storeModel.findOneAndUpdate(
    { user: req.userModel._id },
    {
      $pull: {
        StoreAddress: req.params.addressId,
      },
    },
    {
      new: true,
    }
  );

  //send success response
  res.status(201).json({
    status: true,
    message: `address removed successfully from store `,
    data: document,
  });
});



// @ dec add new address to store
// @ route Post  /api/vi/store/address
// @ access protected/StoreOwner

const addNewAddressToStore = asyncHandler(async (req, res, next) => {
  const document = await storeModel.findOneAndUpdate(
    { user: req.userModel._id },
    {
      $addToSet: {
        StoreAddress: {
          StoreAddressFromMap: req.body.StoreAddressFromMap,
          storeRegion: req.body.storeRegion,
        },
      },
    }
  );

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to add address to store`,
    data: document,
  });
});




// @ dec get all address to store
// @ route get  /api/vi/store/address
// @ access protected/StoreOwner
const getStoreAddress = asyncHandler(async (req, res, next) => {
  const document = await storeModel
    .findById({ user: req.userModel._id })
    .populate("StoreAddress");

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get all address to store`,
    data: document,
  });
});

module.exports = {
  getStoreAddress,
  addNewAddressToStore,
  removeAddressFromStore,
};
