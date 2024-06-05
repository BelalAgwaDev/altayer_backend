const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError/apiError");
const addressModel = require("../../../modules/userAddressModel");






// @ dec update specific address
// @ route Update  /api/vi/address/id
// @ access public
exports.updateAddress = 
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { latitude, longitude, ...rest } = req.body;

    //this code update data from db using id
    const document = await addressModel.findOneAndUpdate(
      { _id: id },
      {
        ...rest,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      }
    );

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get address data from this id ${id}`, 404)
      );
    }

    //send success respons
    res.status(200).json({
      status: true,
      message: `Sucess To Update address data from this id`,
      data:document
    });
  });