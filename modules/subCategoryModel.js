const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'subCategory must be uniqe'],
      required: [true, 'subCategory is required'],
      minlength: [3, 'Too short subCategory name'],
      maxlength: [32, 'Too long subCategory name'],
    },
    image: String,
    publicId: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'subCategory must be belong to parent category'],
    },
  },
  { timestamps: true },
)

// work in get all data ,get specific data ,update data, delete
subCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: 'category', select: 'name image -_id' })
  next()
})

const subCategoryModel = mongoose.model('subCategory', subCategorySchema)

module.exports = subCategoryModel
