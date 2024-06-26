const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ApiError = require('../../../utils/apiError/apiError')

const storeModel = require("../../../modules/storeModel");
const ProductModel = require("../../../modules/productModel");


// @desc Get store details with its products grouped by subcategory
// @route GET /api/v1/store/product/:storeId
// @access Public
exports.getStoreWithProducts = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;

  const store = await storeModel.findById(storeId).lean();

  if (!store) {
    return next(
      new ApiError(`Faild To get this store`, 404),
    )
  }

  const storeWithProducts = await ProductModel.aggregate([
    {
      $match: { store: mongoose.Types.ObjectId(storeId) }
    },
    {
      $lookup: {
        from: 'subCategory',
        localField: 'subCategory',
        foreignField: '_id',
        as: 'subcategoryDetails'
      }
    },
    {
      $unwind: '$subcategoryDetails'
    },
    {
      $group: {
        _id: {
          subcategoryId: '$subcategoryDetails._id',
          subcategoryName: '$subcategoryDetails.name'
        },
        products: { $push: '$$ROOT' }
      }
    },
    {
      $group: {
        _id: null,
        subcategories: {
          $push: {
            _id: '$_id.subcategoryId',
            subCategoryName: '$_id.subcategoryName',
            products: '$products'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        subcategories: 1
      }
    }
  ]);

  res.status(200).json({
    status: true,
    message: 'Store with products retrieved successfully',
    store: store,
    data: storeWithProducts[0] || { subcategories: [] }
  });
});