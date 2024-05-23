const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");



// @ dec add new address to store
// @ route Post  /api/vi/store/address
// @ access protected/StoreOwner

exports.addNewAddressToStore = asyncHandler(async (req, res, next) => {
    const { latitude, longitude, storeRegion } = req.body;
  const document = await storeModel.findOneAndUpdate(
    { user: req.userModel._id },
    {
      $addToSet: {
        StoreAddress: {
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
          storeRegion: storeRegion,
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

