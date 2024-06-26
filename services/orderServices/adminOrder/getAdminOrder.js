const asyncHandler = require("express-async-handler");
const OrderModel = require("../../../modules/orderModel");
const ApiError = require("../../../utils/apiError/apiError");

// //  @dec  get all pending  order to admin
// //  @route  Get /api/v1/orders/admin/pending
// //  @access private/admin
exports.getAllPendingAdminOrder = asyncHandler(async (req, res, next) => {
  const pendingAdminOrders = await OrderModel.find({
    adminStatus: { $in: "Pending" },
  });

  if (!pendingAdminOrders) {
    return next(
      new ApiError(`There are no orders that have been pending to admin`, 404)
    );
  }
  res.status(200).send({
    status: true,
    message: "success to get all admin pending order",
    data: pendingAdminOrders,
  });
});

// //  @dec  get all admin order
// //  @route  Get /api/v1/orders/admin
// //  @access private/admin
exports.getAllAdminOrder = asyncHandler(async (req, res, next) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  const adminOrders = await OrderModel.aggregate([
    {
      $match: {
        adminStatus: { $in: ["Assigned to Delivery", "Delivery Delivered"] },
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $addFields: {
        statusPriority: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$adminStatus", "Assigned to Delivery"] },
                then: 1,
              },
              {
                case: { $eq: ["$adminStatus", "Delivery Delivered"] },
                then: 2,
              },
            ],
            default: 3,
          },
        },
      },
    },
    { $sort: { statusPriority: 1, createdAt: -1 } },
    { $project: { statusPriority: 0 } },
  ]);

  if (adminOrders.length === 0) {
    return next(
      new ApiError(`There are no orders within the specified period.`, 404)
    );
  }
  res.status(200).send({
    status: true,
    message: "Successfully retrieved all orders",
    data: adminOrders,
  });
});
