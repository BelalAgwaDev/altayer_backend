const mongoose = require('mongoose')


const specialOfferSchema = new mongoose.Schema({
  description: { type: String },
  discountPercent: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
});

const bulkPricingSchema = new mongoose.Schema({
  minQty: { type: Number },
  discountRate: { type: Number },
});

// Define the CartItem schema
const cartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  options: [
    {
      optionName: { type: String, required: true },
      additionalPrice: { type: Number, default: 0 },
    },
  ],
  customizations: [
    {
      name: { type: String },
      choice: {
        name: { type: String },
        additionalPrice: { type: Number },
      },
    },
  ],



  specialOffers: [specialOfferSchema],
  bulkPricing: [bulkPricingSchema],
  // Add other unique fields that differentiate products
  notes: { type: String },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number },
})

const CartSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    store: { type: mongoose.Schema.ObjectId, ref: 'Store', required: true },

    storeAddress: {
      location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
      },
      storeRegion: { type: String, required: true },
    },
    cartItems: [cartItemSchema],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  { timestamps: true },
)

// Pre-save hook to calculate the total price for each cart item
cartItemSchema.pre('save', function (next) {
  let baseTotal = (this.price + 
    this.options.reduce((acc, option) => acc + option.additionalPrice, 0) + 
    this.customizations.reduce((acc, customization) => acc + customization.choice.additionalPrice, 0)) * this.quantity;

    if (this.specialOffers && this.specialOffers.length > 0) {
      const now = new Date();
      this.specialOffers.forEach(offer => {
        if (offer.startDate <= now && offer.endDate >= now) {
          baseTotal -= baseTotal * (offer.discountPercent / 100);
        }
      });
    }
  
    if (this.bulkPricing && this.bulkPricing.length > 0) {
      this.bulkPricing.forEach(pricing => {
        if (this.quantity >= pricing.minQty) {
          baseTotal -= baseTotal * (pricing.discountRate / 100);
        }
      });
    }
  
    this.totalItemPrice = baseTotal;
    next();


})


// Pre-save hook to calculate the totalCartPrice and totalPriceAfterDiscount for the cart
CartSchema.pre('save', function(next) {
  this.totalCartPrice = this.cartItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
  next();
});

CartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user', 
    select: 'name email phone',
  }).populate({
    path: 'cartItems.product',
    select: 'title image ',
  })

  next()
})
const CartModel = mongoose.model('Cart', CartSchema)

module.exports = CartModel
