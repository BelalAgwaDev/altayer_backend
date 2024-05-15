const mongoose = require("mongoose");
const moment = require('moment-timezone');

const StoreSchema = mongoose.Schema(
  {
    StoreName: {
      type: String,
      trim: true,
      required: [true, "store Name is Required"],
    },

    StoreDescription: {
      type: String,
      trim: true,
      required: [true, "store description is Required"],
    },

    rating: {
      min: { type: Number, min: 0 },
      max: { type: Number, max: 4 },
      default: 0,
    },

    deliveryTime: String,
    minimumPurchases: mongoose.Types.Decimal128,
    deliveryCharge: mongoose.Types.Decimal128,
    preOrder: Boolean,

    legalStoreName: {
      type: String,
      trim: true,
      required: [true, "Legal store Name is Required"],
    },

    deliveryBy: {
      type: String,
      enum: ["Store", "applicationDelivery","Store And applicationDelivery"],
      default: "applicationDelivery",
    },

   



    openTime: { type: String, required: true },  
    closeTime: { type: String, required: true }, 
    timezone: { type: String, default: 'Africa/Cairo'},  
    isBusy: { type: Boolean, default: false },   
    isBusyManual: { type: Boolean, default: false }, 
    busyHours: [{ start: String, end: String }] , 




    storeLogoImage: String,
    storeCoverImage: String,


    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "category id Required"],
    },

    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "category id Required"],
      },
    ],

   

    StoreAddress: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        StoreAddressFromMap: {
          type: String,
          trim: true,
          required: [true, "store address is Required"],
          minlength: [3, "Too short store adress"],
        },
        storeRegion: {
          type: String,
          trim: true,
          required: [true, "store Region is Required"],
          minlength: [3, "Too short store Region"],
          maxlength: [200, "Too long store Region"],
        },
      },
    ],

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);



StoreSchema.virtual('isOpen').get(function() {
  const now = moment.tz(this.timezone);
  const openingMoment = moment.tz(`${now.format('YYYY-MM-DD')} ${this.openTime}`, this.timezone);
  const closingMoment = moment.tz(`${now.format('YYYY-MM-DD')} ${this.closeTime}`, this.timezone);

  return now.isBetween(openingMoment, closingMoment);
});

StoreSchema.virtual('storeIsBusy').get(function() {
  if (this.isBusyManual) {
    return this.isBusy;
  }

  const now = moment.tz(this.timezone);
  return this.busyHours.some(busyTime => {
    const busyStart = moment.tz(`${now.format('YYYY-MM-DD')} ${busyTime.start}`, this.timezone);
    const busyEnd = moment.tz(`${now.format('YYYY-MM-DD')} ${busyTime.end}`, this.timezone);
    return now.isBetween(busyStart, busyEnd);
  });
});


const StoreModel = mongoose.model("Store", StoreSchema);

module.exports = StoreModel;
