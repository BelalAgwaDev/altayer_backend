const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountAfterPrice: { type: Number },
  subCategory: [{
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Category id Required"],
  }],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "subCategory",
    required: [true, "sub Category id Required"],
  },
  productRelated: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  anyNotes: { type: String },

  image: [{ type: String }],
  availability: { type: Boolean, default: true },
  unitOfSale: { type: String },

  specialOffers: [
    {
      description: { type: String },
      discountPercent: { type: Number },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  ],
  options: [
    {
      optionName: { type: String, required: true },
      additionalPrice: { type: Number, default: 0 },
    },
  ],
  ingredients: [
    {
      name: { type: String, required: true },
      allergens: { type: Boolean, default: false },
    },
  ],

  bulkPricing: [
    {
      minQty: { type: Number },
      discountRate: { type: Number },
    },
  ],

  
  rating: {
    type: Number,
    min: [1, "rating must be above or equal 1.0"],
    max: [5, "rating must be blew or equal 5.0"],
  },

  ratingQuantity: {
    type: Number,
    default: 0,
  },




  customizationOptions: [
    {
      name: { type: String },
      choices: [
        {
          name: { type: String },
          additionalPrice: { type: Number },
        },
      ],
    },
  ],


  storeOwner: 
    {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
    },
  
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
