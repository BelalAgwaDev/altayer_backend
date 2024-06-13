const DriverModel = require("../../modules/driverModel");

const factory = require("../handleFactor/handlerFactory");




// @ dec create Driver
// @ route Post  /api/vi/driver
// @ access protect/driverMan
const creatDriver = factory.creatOne(DriverModel, "driver");

// @ dec get all  Driver data
// @ route Get  /api/vi/driver
// @ access private admin
const getAllDriver = factory.getAllData(DriverModel, "driver");

// @ dec get specific Driver
// @ route Get  /api/vi/driver/id
// @ access private admin
const getOneDriver = factory.getOne(DriverModel, "driver");


// @ dec delete specific Driver
// @ route Update  /api/vi/driver/id
// @ access Private
const deleteDriver = factory.deleteOne(DriverModel, "driver");



module.exports = {
  creatDriver,
  getAllDriver,
  getOneDriver,
  deleteDriver,

};
