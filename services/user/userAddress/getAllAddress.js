const asyncHandler = require("express-async-handler");
const addressModel = require("../../modules/userAddressModel");
// @ dec get all  address data
// @ route Get  /api/vi/address
// @ access public
exports.getAllAddress = () =>
  asyncHandler(async (req, res) => {
    //this code get all data
    const { userId } = req.body.id;

    const document = await addressModel.find({ user: userId });

    //check when no data found in db
    if (!document[0]) {
      // send success response
      return res.status(204).json({
        status: true,
        message: `There is no data entry for this address `,
      });
    }

    // send success response with data
    res.status(200).json({
      status: true,
      message: `Sucess To get all address data`,
      data: document,
    });
  });
