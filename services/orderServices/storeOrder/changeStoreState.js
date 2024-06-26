
const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");

// //  @dec  change order status to Store Approved
// //  @route  Put  /api/v1/orders/:orderId/approveByStore
// //  @access Protect/store
exports.orderApproveByStore = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    { storeStatus: "Store Approved", updatedAt: Date.now() },
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
    .send({ status: true, message: "store approved order", data: order });
});




// //  @dec  change order status to Store Approved
// //  @route  Put  /api/v1/orders/:orderId/completedByStore
// //  @access Protect/store
exports.orderCompletedByStore = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      { storeStatus: "Order Completed", updatedAt: Date.now() },
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
      .send({ status: true, message: "store Order Completed", data: order });
  });
  