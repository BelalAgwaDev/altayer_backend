const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");


// @ dec remove address to store
// @ route delete  /api/vi/store/address/:addressId
// @ access protected/StoreOwner

exports.removeAddressFromStore = asyncHandler(async (req, res, next) => {
  const document = await storeModel.findOneAndUpdate(
    { user: req.userModel._id },
    {
      $pull: {
        StoreAddress: { _id: req.params.id }, 
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
