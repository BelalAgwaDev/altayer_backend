const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Mix ratings value is 5.0'],
      required:[true,'review ratings required']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },

    store: {
      type: mongoose.Schema.ObjectId,
      ref: 'Store',
      required: [true, 'Review must belong to Store'],
    },
  },
  { timestamps: true },
)

const reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel
