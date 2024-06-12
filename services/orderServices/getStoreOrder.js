const asyncHandler = require("express-async-handler");
const OrderModel = require("../../modules/orderModel");
const ApiError = require("../../utils/apiError/apiError");

// //  @dec  get all complete order and cancelled Associated with store
// //  @route  Get /api/v1/orders/user
// //  @access Protect/user
exports.getAllCompleteStoreOrder = asyncHandler(async (req, res, next) => {
  const completedOrCancelledOrders = await OrderModel.find({
    store: req.body.store,
    status: { $in: ["Delivered", "Cancelled"] },
  })
    .sort({ createdAt: -1 });

  if (!completedOrCancelledOrders) {
    return next(
      new ApiError(
        `There are no orders that have been completed or cancelled yet.`,
        404
      )
    );
  }
  res.status(200).send({
    status: true,
    message: "success to get complete orders Associated with store",
    data: completedOrCancelledOrders,
  });
});

// //  @dec  get all pending order to store
// //  @route  Get /api/v1/orders/store/pending
// //  @access Protect/store
exports.getAllPendingStoreOrder = asyncHandler(async (req, res, next) => {
  const storeId = req.body.store;
  const storeOrders = await OrderModel.aggregate([
    {
      $match: {
        store: storeId,
        status: { $in: ["Pending", "Store Approved", "Admin Approved"] },
      },
    },
    {
      $addFields: {
        statusPriority: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "Pending"] }, then: 1 },
              { case: { $eq: ["$status", "Admin Approved"] }, then: 2 },
              { case: { $eq: ["$status", "Store Approved"] }, then: 3 },
            ],
            default: 4,
          },
        },
      },
    },
    { $sort: { statusPriority: 1, createdAt: -1 } },
    { $project: { statusPriority: 0 } },
  ]);

  if (storeOrders.length === 0) {
    return next(new ApiError(`There are no recent orders.`, 404));
  }


  res.status(200).send({
    status: true,
    message: "success to get store pending orders",
    data: storeOrders,
  });
});
