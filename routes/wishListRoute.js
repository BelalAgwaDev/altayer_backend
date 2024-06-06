const express = require('express')
const {
addProductOrStoreInWishList,getAllProductOrStoreFromWishList,removeProductOrStoreFromWishList
} = require('../services/wishListServices/wishList')
const authServices = require('../services/authServices/protect')
const {getLoggedUserData} = require('../services/user/userServices/UserService')

const {
creatWishListValidator} = require('../utils/validators/wishListValidator')


const router = express.Router({mergeParams:true})


// router.route('/').get(createFilterObject,getAllReviews)

// router.route('/:id').get(getReviewValidator,getOneReview)

router.use(authServices.protect)

router
  .route('/')
  .post(
    authServices.allowedTo('user'),
    getLoggedUserData,
    
    creatWishListValidator,
    addProductOrStoreInWishList
  )

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
