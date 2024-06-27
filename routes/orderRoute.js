const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  createCashOrder,checkOutSession
} = require("../services/orderServices/userOrder/orderServices");

const {
  getAllCompleteUserOrder,
  getAllPendingUserOrder,
} = require("../services/orderServices/userOrder/getUserOrder");

const {
  orderCancelled,
} = require("../services/orderServices/userOrder/orderStatus");

const {
  orderApproveByAdmin,
} = require("../services/orderServices/adminOrder/adminChangeState");

const {
  getAllAdminOrder,
  getAllPendingAdminOrder,
} = require("../services/orderServices/adminOrder/getAdminOrder");

const {
  orderApproveByStore,
  orderCompletedByStore,
} = require("../services/orderServices/storeOrder/changeStoreState");

const {
  getAllPendingStoreOrder,
  getAllStorApprovedeOrder,
  getAllStorDoneOrder,
} = require("../services/orderServices/storeOrder/getStoreOrder");

const {
  getAllAdminApprovedOrder,getAlldriverOrder
} = require("../services/orderServices/driverOrder/getDriverOrder");

const {
  orderAssignToDelivery,
  orderDelivered,
  orderDeliveryDelivered,
} = require("../services/orderServices/driverOrder/driverStatus");

const router = express.Router();

router.use(authServices.protect);

//driver
router.use(authServices.allowedTo("driver"));
router.route("/:orderId/assignToDelivery").put(orderAssignToDelivery);
router.route("/:orderId/orderDeliveryDelivered").put(orderDeliveryDelivered);
router.route("/:orderId/orderDelivered").put(orderDelivered);
router.route("driver/pending").get(getAllAdminApprovedOrder);
router.route("driver").get(getAlldriverOrder);

//storeOwner
router.use(authServices.allowedTo("storeOwner"));
router.route("/:orderId/approveByStore").put(orderApproveByStore);
router.route("/:orderId/completedByStore").put(orderCompletedByStore);
router.route("/store/pending").get(getAllPendingStoreOrder);
router.route("/store/storeApproved").get(getAllStorApprovedeOrder);
router.route("/store/done").get(getAllStorDoneOrder);

//admin
router.use(authServices.allowedTo("admin"));
router.route("/:orderId/approveByAdmin").put(orderApproveByAdmin);
router.route("/admin/pending").get(getAllPendingAdminOrder);
router.route("/admin").get(getAllAdminOrder);

//user
router.use(authServices.allowedTo("user"));
router.route("/:cartId").post(createCashOrder);
router.route("/checkOut-session/:cartId").get(checkOutSession);
router.route("/user").get(getAllCompleteUserOrder);
router.route("/user/pending").get(getAllPendingUserOrder);
router.route("/:orderId/cancelled").put(orderCancelled);

module.exports = router;
