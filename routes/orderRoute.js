const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  createCashOrder,

} = require("../services/orderServices/orderServices");

const router = express.Router();

router.use(authServices.protect);



// router
//   .route("/:id/pay")
//   .put(authServices.allowedTo("admin"), updatOrdersToPaid);

// router
//   .route("/:id/delivered")
//   .put(authServices.allowedTo("admin"), updatOrdersToDelivered);

// router
//   .route("/")
//   .get(
//     authServices.allowedTo("user", "admin"),
//     filterOrderForLoggedUser,
//     getallOrders
//   );

 router.use(authServices.allowedTo("user"));
 router.route("/:cartId").post(createCashOrder);
// router.route("/checkOut-session/:cartId").get(checkOutSession);
// router.route("/:id").get(getSpecificOrders);
module.exports = router;
