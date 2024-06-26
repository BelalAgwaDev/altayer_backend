const asyncHandler = require("express-async-handler");
require('dotenv').config({ path: 'config.env' })

const OrderModel = require("../../../modules/orderModel");
const CartModel = require("../../../modules/cartModel");
const ApiError = require("../../../utils/apiError/apiError");

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
    storeAddress: cart.storeAddress,
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



