const asyncHandler = require("express-async-handler");
const DriverModel = require("../../modules/driverModel");
const ApiError = require("../../utils/apiError/apiError");

// //  @dec update driver location
// //  @route  put /api/v1/driver/location
// //  @access protect/driverMan
exports.updateDriverLocation = asyncHandler(async (req, res, next) => {
  const { longitude, latitude } = req.body;

  const driver = await DriverModel.findByIdAndUpdate(
    { user: req.userModel._id },
    { location: { type: "Point", coordinates: [longitude, latitude] } },
    { new: true }
  );

  if (!driver) {
    return next(new ApiError(`driver not found`, 404));
  }
  res.status(200).send({
    status: true,
    message: "success to update driver location",
    data: driver,
  });
});
