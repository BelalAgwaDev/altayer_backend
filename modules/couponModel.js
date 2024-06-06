const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: [true, "Coupon name must be unique"],
      minlength: [3, "too short Coupon name"],
      maxlength: [32, "too long Coupon name"],
    },

    expire: {
      type: Date,
      required: [true, "Coupon expire required"],
    },

    discount: {
      type: Number,
      required: [true, "Coupon discount required"],
    },
  },
  { timestamps: true }
);



const CouponModel = mongoose.model("Coupon", CouponSchema);

module.exports = CouponModel;
