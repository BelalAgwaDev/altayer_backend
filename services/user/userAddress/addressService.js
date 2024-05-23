const asyncHandler = require("express-async-handler");
const addressModel = require("../../modules/userAddressModel");

const factory = require("../handleFactor/handlerFactory");

// @ dec create address
// @ route Post  /api/vi/address
// @ access public
const creatAddress = () =>
  asyncHandler(async (req, res) => {
    const { latitude, longitude, ...rest } = req.body;

    //this code to create
    const document = await addressModel.create({
      ...rest,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    //send success response
    res.status(201).json({
      status: true,
      message: `Successful to create user address`,
      data: document,
    });
  });

// @ dec delete specific address
// @ route Update  /api/vi/address/id
// @ access public
const deleteAddress = factory.deleteOne(addressModel, "address");

module.exports = {
  creatAddress,

  deleteAddress,
};
