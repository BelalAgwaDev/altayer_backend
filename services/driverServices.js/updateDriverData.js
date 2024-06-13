const asyncHandler = require("express-async-handler");
const DriverModel = require("../../modules/driverModel");
const ApiError = require("../../utils/apiError/apiError");

// //  @dec update driver data
// //  @route  put /api/v1/driver
// //  @access protect/driverMan
exports.updateDriverData = asyncHandler(async (req, res, next) => {
  const { region, typeOfTheVehicle, NationalId } = req.body;

  const driver = await DriverModel.findByIdAndUpdate(
    { user: req.userModel._id },
    {
      region: region,
      typeOfTheVehicle: typeOfTheVehicle,
      NationalId: NationalId,
  
    },
    { new: true }
  );

  if (!driver) {
    return next(new ApiError(`driver not found`, 404));
  }
  res.status(200).send({
    status: true,
    message: "success to update driver data",
    data: driver,
  });
});
