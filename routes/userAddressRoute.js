const express = require('express')
const authServices = require('../services/authServices/protect')

const {
  addLoggedUserDataInBody,
} = require('../services/user/userServices/UserService')
const {
  creatAddress,
  passingDataToReqBody,updateAddress,
  deleteAddress,
  createFilterObject,getAllAddress
} = require('../services/user/userAddress/addressService')



const {
  createAddressValidator,
  deleteAddressValidator,

  updateAddressValidator,
} = require('../utils/validators/addressValidator')

const router = express.Router()

router.use(authServices.protect)

router
  .route('/')
  .get(addLoggedUserDataInBody, createFilterObject, getAllAddress)
  .post(
    passingDataToReqBody,
    addLoggedUserDataInBody,
    createAddressValidator,
    creatAddress,
  )

router.route('/:id').delete(deleteAddressValidator, deleteAddress).put(
  passingDataToReqBody,
  addLoggedUserDataInBody,
  updateAddressValidator,
  updateAddress,
)

module.exports = router
