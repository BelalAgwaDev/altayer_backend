const asyncHandler = require("express-async-handler");
const OrderModel = require("../../modules/orderModel");
const ApiError = require("../../utils/apiError/apiError");

// //  @dec  get all 'Store Approved' order to admin
// //  @route  Get /api/v1/orders/admin/pending
// //  @access private/admin
exports.getAllPendingStoreOrder = asyncHandler(async (req, res, next) => {
  const pendingAdminOrders = await OrderModel.find({
    status: { $in: 'Store Approved' },
  })
    .sort({ createdAt: -1 });

  if (!pendingAdminOrders) {
    return next(
      new ApiError(
        `There are no orders that have been pending to admin`,
        404
      )
    );
  }
  res.status(200).send({
    status: true,
    message: "success to get all store approved",
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
        status: { $in: ['Assigned to Delivery', 'In Transit','Pending' , 'Cancelled','Delivered'] },
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $addFields: {
        statusPriority: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", 'Assigned to Delivery'] }, then: 1 },
              { case: { $eq: ["$status", 'In Transit'] }, then: 2 },
              { case: { $eq: ["$status", 'Pending'] }, then: 3 },
              { case: { $eq: ["$status", 'Cancelled'] }, then: 4 },
              { case: { $eq: ["$status", 'Delivered'] }, then: 5 },
            ],
            default: 6,
          },
        },
      },
    },
    { $sort: { statusPriority: 1, createdAt: -1 } },
    { $project: { statusPriority: 0 } },
  ]);



  if (adminOrders.length === 0) {
    return next(new ApiError(`There are no orders within the specified period.`, 404));
  }
  res.status(200).send({
    status: true,
    message: "Successfully retrieved all orders",
    data: adminOrders,
  });
});
