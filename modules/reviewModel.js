const mongoose = require('mongoose')
const storeModel = require("./storeModel");

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

reviewSchema.statics.calcAvrageRatingsQuantity = async function (storeId) {
  const result = await this.aggregate([
    //stage 1: get all reviews in specific product
    {
      $match: { store: storeId },
    },
    //stage 2: grouping reviews based on store id and calc avrage ratings ,ratings quantity 
    {
      $group: {
        _id: "store",
        ratingsAverage: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  
  if (result.length > 0) {
    await storeModel.findByIdAndUpdate(storeId, {
      ratingsAverage: result[0].ratingsAverage,
      ratingsQuantity: result[0].ratingsQuantity,

    });
  }else{
    await storeModel.findByIdAndUpdate(storeId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,

    });
  }
};



reviewSchema.post('save', async function () {
  await this.constructor.calcAvrageRatingsQuantity(this.store);
});


reviewSchema.post('deleteOne', { document: true, query: false }, async function () {

  await this.constructor.calcAvrageRatingsQuantity(this.store);
});


reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

const reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel
