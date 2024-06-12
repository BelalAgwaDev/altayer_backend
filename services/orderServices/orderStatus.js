const asyncHandler = require("express-async-handler");
const OrderModel = require("../../modules/orderModel");
const ApiError = require("../../utils/apiError/apiError");

// //  @dec  change order status to Store Approved
// //  @route  Put  /api/v1/orders/:orderId/approveByStore
// //  @access Protect/store
exports.orderApproveByStore = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    { status: "Store Approved", updatedAt: Date.now() },
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

// //  @dec  change order status to assign To Delivery
// //  @route  Put  /api/v1/orders/:orderId/assignToDelivery
// //  @access Protect/delivery man
exports.orderAssignToDelivery = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    { status: "Assigned to Delivery", updatedAt: Date.now(),deliveryPerson: req.userModel._id },
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
    .send({ status: true, message: "order assigned to delivery", data: order });
});

// //  @dec  change order status to inTransit
// //  @route  Put  /api/v1/orders/:orderId/inTransit
// //  @access Protect/delivery man
exports.orderInTransit = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    { status: "In Transit", updatedAt: Date.now() },
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
    .send({ status: true, message: "order in transit", data: order });
});

// //  @dec  change order status to approve By Admin
// //  @route  Put  /api/v1/orders/:orderId/approveByAdmin
// //  @access Protect/admin
exports.orderApproveByAdmin = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    { status: "Admin Approved", updatedAt: Date.now() },
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
    .send({ status: true, message: "admin approved order", data: order });
});

// //  @dec  change order status to Delivered
// //  @route  Put  /api/v1/orders/:orderId/delivered
// //  @access Protect/user
exports.orderDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    { status: "Delivered", updatedAt: Date.now() },
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
    .send({ status: true, message: "order delivered", data: order });
});


// //  @dec  change order status to Cancelled
// //  @route  Put  /api/v1/orders/:orderId/Cancelled
// //  @access Protect/user
exports.orderCancelled = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      { status: "Cancelled", updatedAt: Date.now() },
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
  