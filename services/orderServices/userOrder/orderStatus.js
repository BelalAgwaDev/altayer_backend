const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");


// //  @dec  change order status to Cancelled
// //  @route  Put  /api/v1/orders/:orderId/Cancelled
// //  @access Protect/user
exports.orderCancelled = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    { orderStatus: "Cancelled" },
    { new: true }
  );
  if (!order) {
    return next(
      new ApiError(
        `there is no order with this id : ${req.params.orderId}`,
        404
      )
    );
  }
  res
    .status(200)
    .send({ status: true, message: "order Cancelled", data: order });
});
