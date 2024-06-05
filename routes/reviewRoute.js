const express = require('express')
const {
creatReview,deleteReview,getAllReviews,getOneReview,updateReview
} = require('../services/reviewServices/reviewService')
const authServices = require('../services/authServices/protect')
const {addLoggedUserDataInBody} = require('../services/user/userServices/UserService')

// const {
//   createCatogryValidator,
//   getCategoryValidator,
//   updateCatogryValidator,
//   deleteCatogryValidator,
// } = require('../utils/validators/categoryValidator')

const subCategoryRoute = require('./subCategoryRoute')

const router = express.Router()

router.use('/:categoryId/subCategories', subCategoryRoute)

router.route('/').get(getAllReviews)

router.route('/:id').get(getOneReview)

router.use(authServices.protect, authServices.allowedTo('user'))

router
  .route('/')
  .post(
    addLoggedUserDataInBody,
    creatReview
  )

router
  .route('/:id')
  .put(
    addLoggedUserDataInBody,
    updateReview
  )

  .delete(authServices.allowedTo('admin','user'),deleteReview)

module.exports = router
