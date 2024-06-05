const asyncHandler = require('express-async-handler')

const storeModel = require('../../../modules/storeModel')
const { uploadAndSaveImageToCloudinary } = require('../../../middleware/cloudinaryMiddleWare')


const {resizeAndSaveImage} = require('../../../middleware/resizeImage')
const factory = require('../../handleFactor/handlerFactory')
const {
    uploadListOfImage,
  } = require('../../../middleware/imageUploadMiddleware')
  
// Middleware to handle multiple files (adjust field names as needed)

exports.updateUploadStoreImage = uploadListOfImage([
    {
      name: 'storeCoverImage',
      maxCount: 1,
    },
    {
      name: 'storeLogoImage',
      maxCount: 1,
    },
  ])

  
//upload single image
exports.resizeUpdateStoreImage = asyncHandler(async (req, res, next) => {
    if (req.files) {
      const resizedImagePromise = resizeAndSaveImage(
        req.files.storeCoverImage?req.files.storeCoverImage[0]:req.files.storeLogoImage[0],
        'store',
        req.files.storeCoverImage?'storeCoverImage':'storeLogoImage',
        req,
      )
   
  
      const uploadedImages = await Promise.all([
        resizedImagePromise,
      ])
  
      req.body.uploadedImages = uploadedImages
      
  
    }
  
    next()
  })




// upload images in cloud
exports.uploadUpdatesdImageInCloud = asyncHandler(async (req, res, next) => {
  

    if (req.files && req.body.uploadedImages && req.body.uploadedImages.length > 0) {
 
      try {
        const uploadImageInCloudPromise = uploadAndSaveImageToCloudinary(
          req.body.uploadedImages[0].filePath,
          req.body.uploadedImages[0].directorPath,
          req.body.uploadedImages[0].imageType,
          req,
          next,
        );
  
    
  
       await Promise.all([uploadImageInCloudPromise]);

  
      } catch (error) {
        return next(error); // Passes any error to the error handling middleware
      }
    }
    next();
  })





// @ dec update specific image from store
// @ route Update  /api/vi/store//image/id
// @ access Private
exports.updateStoreImage = factory.updateOne(storeModel, 'store')




// @ dec delete photo from cloud using when update
exports.deleteImageBeforeUpdate = factory.deletePhotoFromCloud(storeModel)