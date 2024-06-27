const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");

// //  @dec  get all pending order to store
// //  @route  Get /api/v1/orders/store/pending
// //  @access Protect/store
exports.getAllPendingStoreOrder = asyncHandler(async (req, res, next) => {
  const storeOrders = await OrderModel.find({
    store: req.body.store,
    storeStatus: { $in: "Pending" },
  });

  if (!storeOrders) {
    return next(new ApiError(`There are no recent orders.`, 404));
  }

  res.status(200).send({
    status: true,
    message: "success to get store pending orders",
    data: storeOrders,
  });
});

// //  @dec  get all Store Approved order
// //  @route  Get /api/v1/orders/store/storeApproved
// //  @access private/store
exports.getAllStorApprovedeOrder = asyncHandler(async (req, res, next) => {
  const storApprovedeOrders = await OrderModel.find({
    store: req.body.store,
    storeStatus: { $in: "Store Approved" },
  }).sort({ createdAt: -1 });

  if (!storApprovedeOrders) {
    return next(
      new ApiError(`There are no orders that have been Approved to store`, 404)
    );
  }
  res.status(200).send({
    status: true,
    message: "success to get all store approved order",
    data: storApprovedeOrders,
  });
});



// //  @dec  get all Store Completed,Delivered order
// //  @route  Get /api/v1/orders/store/done
// //  @access private/store
exports.getAllStorDoneOrder = asyncHandler(async (req, res, next) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  const storeDoneOrder = await OrderModel.aggregate([
    {
      $match: {
        store: req.body.store,
        storeStatus: { $in: ["Order Completed", "Delivery Delivered"] },
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $addFields: {
        statusPriority: {
          $switch: {
            branches: [
              { case: { $eq: ["$storeStatus", "Order Completed"] }, then: 1 },
              {
                case: { $eq: ["$storeStatus", "Delivery Delivered"] },
                then: 2,
              },
            ],
            default: 3,
          },
        },
      },
    },
    { $sort: { storeStatusPriority: 1, createdAt: -1 } },
    { $project: { storeStatusPriority: 0 } },
  ]);

  if (storeDoneOrder.length === 0) {
    return next(
      new ApiError(`There are no orders within the specified period.`, 404)
    );
  }
  res.status(200).send({
    status: true,
    message: "Successfully retrieved all orders",
    data: storeDoneOrder,
  });
});
