const mongoose = require("mongoose");

const UserAddressSchema = mongoose.Schema(
  {
   
  
    alias: {
      type: String,
      enum: ["Apartment", "House", "Office"],
      default: "Apartment",
    },

    BuildingName: {
      type: String,
      trim: true,
      required: [true, "Address Building Name required"],
      minlength: [3, "too short Address Building Name"],
      maxlength: [50, "too long Address Building Name"],
    },

    apartmentNumber: String,
    floor: String,
    region: {
      type: String,
      trim: true,
      required: [true, "Address region required"],
      minlength: [3, "too short Address region"],
      maxlength: [50, "too long Address region"],
    },
    additionalDirections: String,
    streetName:String,
    phone: {
      type: String,
      required: [true, "phone required"],

    },
    addressLabel: String,

    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type:[Number],
        required: true,
      },
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

UserAddressSchema.index({ location: '2dsphere' });

const AddressModel = mongoose.model("UserAddress", UserAddressSchema);

module.exports = AddressModel;
