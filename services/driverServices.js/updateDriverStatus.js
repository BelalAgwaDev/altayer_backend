const asyncHandler = require("express-async-handler");
const DriverModel = require("../../modules/driverModel");
const ApiError = require("../../utils/apiError/apiError");

// //  @dec update driver status
// //  @route  put /api/v1/driver/status
// //  @access protect/driverMan
exports.updateDriverStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!["Active", "Inactive", "Suspended"].includes(status)) {
    return next(new ApiError(`Invalid status`, 404));
  }
  const driver = await DriverModel.findByIdAndUpdate(
    { user: req.userModel._id },
    { status: status },
    {new:true}
  )

  if (!driver) {
    return next(
      new ApiError(`driver not found`, 404)
    );
  }
  res.status(200).send({
    status: true,
    message: "success to update driver status",
    data: driver,
  });
});
