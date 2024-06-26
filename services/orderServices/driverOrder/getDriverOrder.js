const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");
const DriverModel = require("../../../modules/driverModel");

// //  @dec  get all Admin Approved  order to driver
// //  @route  Get /api/v1/orders/driver/pending
// //  @access private/driver
exports.getAllAdminApprovedOrder = asyncHandler(async (req, res, next) => {
  const driver = await DriverModel.findById(req.userModel._id);

  if (!driver) {
    return next(
      new ApiError(
        `there is no driver with this id : ${req.userModel._id}`,
        404
      )
    );
  }
  const driverLocation = driver.location;

  const adminApprovedOrders = await OrderModel.find({
    adminStatus: { $in: "Admin Approved" },
    storeAddress: {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [driverLocation.longitude, driverLocation.latitude],
          },
          $maxDistance: 5000,
        },
      },
    },
  });

  if (!adminApprovedOrders) {
    return next(
      new ApiError(
        `There are no orders that have been admin approved to driver`,
        404
      )
    );
  }
  res.status(200).send({
    status: true,
    message: "success to get all admin approved order",
    data: adminApprovedOrders,
  });
});


// //  @dec  get all driver order
// //  @route  Get /api/v1/orders/driver
// //  @access private/driver man
exports.getAlldriverOrder = asyncHandler(async (req, res, next) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  const driverOrder = await OrderModel.find({
    deliveryPerson: req.userModel._id,
  }).sort({ createdAt: { $gte: start, $lte: end } });



  if (!driverOrder) {
    return next(
      new ApiError(`There are no orders within the specified period.`, 404)
    );
  }
  res.status(200).send({
    status: true,
    message: "Successfully retrieved all orders",
    data: driverOrder,
  });
});
