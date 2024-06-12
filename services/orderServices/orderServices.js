const asyncHandler = require("express-async-handler");
require('dotenv').config({ path: 'config.env' })

const OrderModel = require("../../modules/orderModel");
const CartModel = require("../../modules/cartModel");
const ApiError = require("../../utils/apiError/apiError");

//  @dec    create cash Order
//  @route  Post  /api/v1/orders/cardId
//  @access Protect/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  //1) get Cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this  id : ${req.params.cartId}`, 404)
    );
  }

  //2) get order price depend on cart price "check coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;



  //3) create order with default payment method type cash
  const order = await OrderModel.create({
    user: req.userModel._id,
    store: cart.store,
    cartItems: cart.cartItems,
    totalOrderPrice: totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  if (order) {

    //4) clear cart depend on cartId
    await CartModel.findByIdAndDelete(req.params.cartId);
  }
  res.status(200).send({ status: true, message: "Order created successfully", data: order });
});



// //  @dec    get all Orders
// //  @route  Post  /api/v1/orders
// //  @access Protect/user/admin
// exports.getallOrders = factory.getAll(OrderModel);

// //  @dec    get specific Orders
// //  @route  Post  /api/v1/orders
// //  @access Protect/user/admin
// exports.getSpecificOrders = factory.getOne(OrderModel);

// //  @dec    update  Orders paid status to paid
// //  @route  Put  /api/v1/orders/id/pay
// //  @access Protect/admin
// exports.updatOrdersToPaid = asyncHandler(async (req, res, next) => {
//   const order = await OrderModel.findById(req.params.id);

//   if (!order) {
//     return next(
//       new ApiError(`there is such a order with this id: ${req.params.id}`, 404)
//     );
//   }

//   order.isPaid = true;
//   order.paitAt = Date.now();

//   const updateOrder = await order.save();
//   res.status(200).send({ status: "success", data: updateOrder });
// });


// //  @dec    update  Orders Delivered status to true
// //  @route  Put  /api/v1/orders/id/delivered
// //  @access Protect/admin
// exports.updatOrdersToDelivered = asyncHandler(async (req, res, next) => {
//   const order = await OrderModel.findById(req.params.id);

//   if (!order) {
//     return next(
//       new ApiError(`there is such a order with this id: ${req.params.id}`, 404)
//     );
//   }

//   order.isDelivered = true;
//   order.deliveredAt = Date.now();

//   const updateOrder = await order.save();
//   res.status(200).send({ status: "success", data: updateOrder });
// });


// //  @dec    Get checkOut session from strip and send it as response
// //  @route  Get  /api/v1/orders/checkOut-session/cartId
// //  @access Protect/user
// exports.checkOutSession = asyncHandler(async (req, res, next) => {

//   const taxPrice = 0;
//   const shippingPrice = 0;
// //1) get Cart depend on cartId
// const cart = await CartModel.findById(req.params.cartId);
// if (!cart) {
//   return next(
//     new ApiError(`there is no cart for this  id : ${req.params.cartId}`, 404)
//   );
// }

//   //2) get order price depend on cart price "check coupon apply"
//   const cartPrice = cart.totalPriceAfterDiscount
//     ? cart.totalPriceAfterDiscount
//     : cart.totalCartPrice;

//   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

//   //3) check strips checkOut session
 


//   //4) send session to response
//   res.status(200).send({ status: "success"});
// });



