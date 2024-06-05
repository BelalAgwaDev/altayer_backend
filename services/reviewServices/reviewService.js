
const reviewModel = require('../../modules/reviewModel')


const factory = require('../handleFactor/handlerFactory')


// @ dec create reviews
// @ route Post  /api/vi/reviews
// @ access public
const creatReview = factory.creatOne(reviewModel, 'reviews')

// @ dec get all  category data
// @ route Get  /api/vi/reviews
// @ access public
const getAllReviews = factory.getAllData(reviewModel, 'reviews')

// @ dec get specific reviews
// @ route Get  /api/vi/reviews/id
// @ access public
const getOneReview = factory.getOne(reviewModel, 'reviews')

// @ dec update specific reviews
// @ route Update  /api/vi/reviews/id
// @ access Private
const updateReview = factory.updateOne(reviewModel, 'reviews')

// @ dec delete specific reviews
// @ route DELETE  /api/vi/reviews/id
// @ access Private
const deleteReview = factory.deleteOne(reviewModel, 'reviews')




module.exports = {
  creatReview,
  getAllReviews,
  getOneReview,
  updateReview,
  deleteReview,
}
