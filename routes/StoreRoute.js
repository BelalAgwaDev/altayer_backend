const express = require('express')
const  reviewRoute  = require('./reviewRoute')

const authServices = require('../services/authServices/protect')
const { createStoreValidator } = require('../utils/validators/storeValidator')
const {
  addLoggedUserDataInBody,
} = require('../services/user/userServices/UserService')
const {
  createStore,
  addAddressAndSomeDataToStore,

  uploadStoreImage,
  uploadImageInCloud,
  resizeStoreImage,
} = require('../services/storeScervice/store/createStore')

const { getAllStore } = require('../services/storeScervice/store/getAllStore')
const {
  getAllStoreNearbyInUser,
} = require('../services/storeScervice/store/getAllStoreNearbyUser')

const { getStore } = require('../services/storeScervice/store/getStore')
const {
  addBusyTimeToStore,
  removeBusyTimeToStore,
  getAllStoreBusyTime,
} = require('../services/storeScervice/busyTime/addBusyTime')
const { updateStore } = require('../services/storeScervice/store/updateStore')
const {
  updateDeliveryBy,
} = require('../services/storeScervice/store/updateDeliverBy')
const {
  updateStoreState,
} = require('../services/storeScervice/store/updateState')
const {
  updateTimeState,
} = require('../services/storeScervice/store/updateTimeState')

const {
  deleteImageBeforeUpdate,
  updateStoreImage,
  resizeUpdateStoreImage,
  uploadUpdatesdImageInCloud,
  updateUploadStoreImage,
} = require('../services/storeScervice/store/updateImage')

const router = express.Router()



//post  /store/storeId/reviews
//Get  /store/storeId/reviews
//Get  /store/storeId/reviews/reviewId
router.use("/:storeId/reviews", reviewRoute);

router.use(authServices.protect)

router.route('/').get(getAllStore)
router.route('/storeNearby').get(getAllStoreNearbyInUser)
router.route('/:id').get(getStore)

router.use(authServices.allowedTo('admin', 'storeOwner'))

router
  .route('/')
  .post(
    uploadStoreImage,
    resizeStoreImage,
    uploadImageInCloud,
    addLoggedUserDataInBody,
    createStoreValidator,
    createStore,
  )

router.route('/busyTime/:id').post(addBusyTimeToStore)

router.route('/busyTime/:id').delete(removeBusyTimeToStore)

router.route('/busyTime/:id').get(getAllStoreBusyTime)
router.route('/continueCreation').post(addAddressAndSomeDataToStore)

router.route('/:id').put(updateStore)

router.route('/storeState/:id').put(updateStoreState)

router.route('/deliveryBy/:id').put(updateDeliveryBy)

router.route('/timeState/:id').put(updateTimeState)

router
  .route('/image/:id')
  .put(
    updateUploadStoreImage,
    resizeUpdateStoreImage,
    uploadUpdatesdImageInCloud,
    deleteImageBeforeUpdate,
    updateStoreImage,
  )

module.exports = router
