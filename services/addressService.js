const addressModel = require("../modules/addressModel");

const factory = require("./handlerFactory");



// @ dec create address
// @ route Post  /api/vi/address
// @ access public
const creatAddress = factory.creatOne(addressModel, "address");

// @ dec get all  address data
// @ route Get  /api/vi/address
// @ access public
const getAllAddress = factory.getAllData(addressModel, "address");

// @ dec get specific address
// @ route Get  /api/vi/address/id
// @ access public
const getOneAddress = factory.getOne(addressModel, "address");

// @ dec update specific address
// @ route Update  /api/vi/address/id
// @ access public
const updateAddress = factory.updateOne(addressModel, "address");

// @ dec delete specific address
// @ route Update  /api/vi/address/id
// @ access public
const deleteAddress = factory.deleteOne(addressModel, "address");

// @ dec delete all address
// @ route Update  /api/vi/address
// @ access public
const deleteAllAddress = factory.deleteAll(addressModel, "address");

module.exports = {
  creatAddress,
  getAllAddress,
  getOneAddress,
  updateAddress,
  deleteAddress,
  deleteAllAddress,

};
