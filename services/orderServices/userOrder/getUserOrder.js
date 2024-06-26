const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");

// //  @dec  get all complete order and cancelled to user
// //  @route  Get /api/v1/orders/user
// //  @access Protect/user
exports.getAllCompleteUserOrder = asyncHandler(async (req, res, next) => {
  const completedOrCancelledOrders = await OrderModel.find({
    user: req.userModel._id,
    orderStatus: { $in: ["Delivered", "Cancelled"] },
  })
    .sort({ createdAt: -1 })
    .limit(25);

  if (!completedOrCancelledOrders) {
    return next(
      new ApiError(
        `There are no orders that have been completed or cancelled yet.`,
        404
      )
    );
  }
  res
    .status(200)
    .send({
      status: true,
      message: "success to get user orders",
      data: completedOrCancelledOrders,
    });
});



// //  @dec  get all pending order to user
// //  @route  Get /api/v1/orders/user/pending
// //  @access Protect/user
exports.getAllPendingUserOrder = asyncHandler(async (req, res, next) => {
    const pendingOrders = await OrderModel.find({
      user: req.userModel._id,
      orderStatus: { $ne: ["Delivered", "Cancelled"] },
    })
      .sort({ createdAt: -1 })
     
  
    if (!pendingOrders) {
      return next(
        new ApiError(
          `There are no recent orders.`,
          404
        )
      );
    }
    res
      .status(200)
      .send({
        status: true,
        message: "success to get user pending orders",
        data: pendingOrders,
      });
  });
  