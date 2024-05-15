const DriverModel = require("../modules/driverModel");
const { uploadListOfImage } = require("../middleware/imageUploadMiddleware");
const resizeImage = require("../middleware/resizeImage");
const factory = require("./handlerFactory");

//upload single image
const uploadDriverImage = uploadListOfImage(["frontNationalIdImage","backNationalIdImage"]);

// rssize image before upload
const resizeDriverImage = resizeImage("driver");

// @ dec create Driver
// @ route Post  /api/vi/driver
// @ access private
const creatDriver = factory.creatOne(DriverModel, "driver");

// @ dec get all  Driver data
// @ route Get  /api/vi/driver
// @ access public
const getAllDriver = factory.getAllData(DriverModel, "driver");

// @ dec get specific Driver
// @ route Get  /api/vi/driver/id
// @ access public
const getOneDriver = factory.getOne(DriverModel, "driver");

// @ dec update specific Driver
// @ route Update  /api/vi/driver/id
// @ access Private
const updateDriver = factory.updateOne(DriverModel, "driver");

// @ dec delete specific Driver
// @ route Update  /api/vi/driver/id
// @ access Private
const deleteDriver = factory.deleteOne(DriverModel, "driver");

// @ dec delete all Driver
// @ route Update  /api/vi/driver
// @ access Private
const deleteAllDriver = factory.deleteAll(DriverModel, "driver");

module.exports = {
  creatDriver,
  getAllDriver,
  getOneDriver,
  updateDriver,
  deleteDriver,
  deleteAllDriver,
  uploadDriverImage,
  resizeDriverImage,
};
