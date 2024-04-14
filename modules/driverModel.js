const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const driverSchema = new mongoose.Schema(
  {

   region: {
    type: String,
    trim: true,
    required: [true, "Address region required"],
    minlength: [3, "too short Address region"],
    maxlength: [50, "too long Address region"],
  },
    

  typeOfTheVehicle:{
    type: String,
    enum: ["car", "withOutAVehicle", "bicycle","motorcycle"],
    default: "motorcycle",
  },

  nationalImage:[String],

  anotherPhone:String,
  
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
    const imageUrl = `${process.env.BASE_URL}/user/${doc}`;
    return imageUrl;
  }
};

//work in create data
driverSchema.pre("save", async function (next) {
  this.image = setImageUrl(this.image);
  if (!this.isModified("password")) return next();
  //hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const driverModel = mongoose.model("User", driverSchema);

module.exports = driverModel;
