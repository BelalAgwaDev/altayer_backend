const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {

   region: {
    type: String,
    trim: true,
    required: [true, "Address region required"],
    minlength: [3, "too short Address region"],
    maxlength: [50, "too long Address region"],
  },
    

  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },

  typeOfTheVehicle: {
    type: String,
    enum: ["car", "withOutAVehicle", "bicycle", "motorcycle"],
    default: "motorcycle",
  },

  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },

  NationalId: {
    type: String,
    trim: true,
    required: [true, "National Id required"],
    minlength: [14, "too short National Id"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },


  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  //return image base url + image name
  if (doc) {
    const imageUrl = `${process.env.BASE_URL}/driver/${doc}`;
    return imageUrl;
  }
};

//work in create data
driverSchema.pre("save", async function (next) {
  this.frontNationalIdImage = setImageUrl(this.frontNationalIdImage);
  this.backNationalIdImage = setImageUrl(this.backNationalIdImage);
  next();
});

const driverModel = mongoose.model("driver", driverSchema);

module.exports = driverModel;
