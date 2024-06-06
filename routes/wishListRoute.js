const express = require('express')
const {
  addProductOrStoreInWishList,
  getAllProductOrStoreFromWishList,
  removeProductOrStoreFromWishList,
} = require('../services/wishListServices/wishList')
const authServices = require('../services/authServices/protect')
const {
  getLoggedUserData,
} = require('../services/user/userServices/UserService')

const {
  creatWishListValidator,
} = require('../utils/validators/wishListValidator')

const router = express.Router({ mergeParams: true })

// router.route('/:id').get(getReviewValidator,getOneReview)

router.use(authServices.protect, authServices.allowedTo('user'))

router
  .route('/')
  .post(
    getLoggedUserData,
    creatWishListValidator,
    addProductOrStoreInWishList,
  )
  .get(getLoggedUserData, getAllProductOrStoreFromWishList)

// router
//   .route('/:id')
//   .put(
//     authServices.allowedTo('user'),
//     addLoggedUserDataInBody,
//     updateReviewValidator,
//     updateReview
//   )

// .delete(authServices.allowedTo('admin','user'), addLoggedUserDataInBody,deleteReviewValidator,deleteReview)

module.exports = router
