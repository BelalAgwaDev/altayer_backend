const asyncHandler = require('express-async-handler')

const { resizeAndSaveImage } = require('../../../middleware/resizeImage')
const {
  uploadAndSaveImageToCloudinary,
} = require('../../../middleware/cloudinaryMiddleWare')

const storeModel = require('../../../modules/storeModel')
const factory = require('../../handleFactor/handlerFactory')

const {
  uploadListOfImage,
} = require('../../../middleware/imageUploadMiddleware')

// Middleware to handle multiple files (adjust field names as needed)

exports.uploadStoreImage = uploadListOfImage([
  {
    name: 'storeCoverImage',
    maxCount: 1,
  },
  {
    name: 'storeLogoImage',
    maxCount: 1,
  },
])

exports.resizeStoreImage = asyncHandler(async (req, res, next) => {
  if (req.files) {
    const resizedCoverImagePromise = resizeAndSaveImage(
      req.files.storeCoverImage[0],
      'store',
      'storeCoverImage',
      req,
    )
    const resizedLogoImagePromise = resizeAndSaveImage(
      req.files.storeLogoImage[0],
      'store',
      'storeLogoImage',
      req,
    )

    const uploadedImages = await Promise.all([
      resizedCoverImagePromise,
      resizedLogoImagePromise,
    ])

    req.body.uploadedImages = uploadedImages

  }

  next()
})

// upload images in cloud
exports.uploadImageInCloud = asyncHandler(async (req, res, next) => {
  

  if (req.files && req.body.uploadedImages && req.body.uploadedImages.length > 1) {
    try {
      const uploadCoverImageInCloudPromise = uploadAndSaveImageToCloudinary(
        req.body.uploadedImages[0].filePath,
        req.body.uploadedImages[0].directorPath,
        req.body.uploadedImages[0].imageType,
        req,
        next,
      );

      const uploadLogoImageInCloudPromise = uploadAndSaveImageToCloudinary(
        req.body.uploadedImages[1].filePath,
        req.body.uploadedImages[1].directorPath,
        req.body.uploadedImages[1].imageType,
        req,
        next,
      );

     await Promise.all([uploadCoverImageInCloudPromise, uploadLogoImageInCloudPromise]);

    } catch (error) {
      return next(error); // Passes any error to the error handling middleware
    }
  }
  next();
})




// @ dec create new store
// @ route Post  /api/vi/store/
// @ access protected/StoreOwner

exports.createStore = factory.creatOne(storeModel, 'store')

// @ dec create new store
// @ route post  /api/vi/store/continueCreation
// @ access protected/StoreOwner
exports.addAddressAndSomeDataToStore = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.body

  // create user
  const document = await storeModel.findOneAndUpdate(
    { user: req.userModel._id },
    {
      $addToSet: {
        StoreAddress: {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          storeRegion: req.body.storeRegion,
        },
      },
      deliveryTime: req.body.deliveryTime,

      openTime: req.body.storeTimeOpen,

      closeTime: req.body.storeTimeClose,
      minimumPurchases: req.body.minimumPurchases,
      deliveryCharge: req.body.deliveryCharge,
      preOrder: req.body.preOrder,
    },
    {
      new: true,
    },
  )

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to add address to store`,
    data: document,
  })
})
