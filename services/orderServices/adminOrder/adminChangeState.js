const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");
const { findAvailableDrivers, sendNotificationToDriver } = require('../driverOrder/driverSocketUtils');

// //  @dec  change order status to approve By Admin
// //  @route  Put  /api/v1/orders/:orderId/approveByAdmin
// //  @access Protect/admin
exports.orderApproveByAdmin = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { adminStatus: "Admin Approved" },
    { new: true }
  );
  if (!order) {
    return next(
      new ApiError(`there is no order with this id : ${orderId}`, 404)
    );
  }

  const drivers = await findAvailableDrivers(order.storeAddress.location);

  drivers.forEach((driver) => {
    sendNotificationToDriver(driver._id, `New order available: ${orderId}`);
  });

  res
    .status(200)
    .send({
      status: true,
      message:
        "send notification to drivers and update order status to admin approved",
    });
});



