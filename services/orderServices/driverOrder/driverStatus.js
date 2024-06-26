const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");

// //  @dec  change order status to assign To Delivery
// //  @route  Put  /api/v1/orders/:orderId/assignToDelivery
// //  @access Protect/delivery man
exports.orderAssignToDelivery = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      {
        adminStatus: "Assigned to Delivery",
        deliveryPerson: req.userModel._id,
      },
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
  
  
  
  
  // //  @dec  change order status to assign To Delivery
  // //  @route  Put  /api/v1/orders/:orderId/orderDeliveryDelivered
  // //  @access Protect/delivery man
  exports.orderDeliveryDelivered = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      {
        storeStatus: "Delivery Delivered",
        adminStatus: "Delivery Delivered",
        orderStatus:  "In Transit",
      },
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
      .send({ status: true, message: "order Delivery Delivered", data: order });
  });
  
  


  // //  @dec  change order status to Delivered
// //  @route  Put  /api/v1/orders/:orderId/delivered
// //  @access Protect/delivery man
exports.orderDelivered = asyncHandler(async (req, res, next) => {

  const order = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    {
      orderStatus: "Delivered",
      isPaid: true,
      paitAt: Date.now(),
    },
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