const addressModel = require('../../../modules/userAddressModel')

const factory = require('../../handleFactor/handlerFactory')

//passing data to body in create 
const passingDataToReqBody = (req, res, next) => {
  const { latitude, longitude, ...rest } = req.body

  req.body = {
    ...rest,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
  };

  next();
}


//using to get all address user login
const createFilterObject = (req, res, next) => {
  req.filterObject = { user: req.body.user }
  next()
}

// @ dec create address
// @ route Post  /api/vi/address
// @ access protected
const creatAddress = factory.creatOne(addressModel, 'address')

// @ dec get all  address data
// @ route Get  /api/vi/address
// @ access protected
const getAllAddress = factory.getAllData(addressModel, 'address')

// @ dec delete specific address
// @ route Update  /api/vi/address/id
// @ access protected
const deleteAddress = factory.deleteOne(addressModel, 'address')

// @ dec update specific address
// @ route Update  /api/vi/address/id
// @ access protected
const updateAddress = factory.updateOne(addressModel, 'address')

module.exports = {
  creatAddress,
  passingDataToReqBody,
  deleteAddress,
  getAllAddress,
  createFilterObject,
  updateAddress,
}
