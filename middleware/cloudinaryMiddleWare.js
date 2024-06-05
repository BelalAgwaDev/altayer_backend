const cloudinary = require('cloudinary').v2
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const path = require('path')
const ApiError = require('../utils/apiError/apiError')

// Function to delete an image from Cloudinary
const deleteImageFromCloudinary = asyncHandler(async (publicId) => {
  await cloudinary.uploader.destroy(publicId)
})

//Middleware to upload an image to Cloudinary
const uploadToCloudinary = () =>
  asyncHandler(async (req, res, next) => {

    if (req.file) {
      const filePath = path.join(req.body.imageUrl)
      if (fs.existsSync(filePath)) {
        cloudinary.uploader.upload(
          filePath,
          {
            folder: req.body.directorUrl,
            use_filename: true,
          },
          (error, result) => {
            if (result) {
              fs.unlink(filePath, (err, cb) => {
                if (err) {
                  cb(new ApiError('only images are allowed', 400), false)
                } else {
                  req.body.image = result.url
                  req.body.publicId = result.publicId
                  next()
                }
              })
            } else {
              fs.unlink(filePath, () => {})
  
              return next(
                new ApiError(
                  `upload image error try again ${error.message}`,
                  400,
                ),
              )
            }
          },
        )
      }
    }

    next()


 
  })


const uploadAndSaveImageToCloudinary = async (file, directorName, imageType, req) => {
  const filePath = path.join(file);

  if (fs.existsSync(filePath)) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          folder: directorName,
          use_filename: true,
        },
        (error, result) => {
          if (error) {
            fs.unlink(filePath, () => {}); // Clean up the file
            reject(new ApiError(`upload image error, try again: ${error.message}`, 400));
          } else {
            fs.unlink(filePath, (err) => {
              if (err) {
                reject(new ApiError('only images are allowed', 400));
              } else {
                // Save image information into the request body
                switch (imageType) {
                  case 'image':
                    req.body.image = result.url;
                    req.body.publicId = result.public_id;
                    break;
                  case 'storeCoverImage':
                    req.body.storeCoverImage = result.url;
                    req.body.storeCoverImagePublicId = result.public_id;
                    break;
                  case 'storeLogoImage':
                    req.body.storeLogoImage = result.url;
                    req.body.storeLogoImagePublicId = result.public_id;
                    break;
                  default:
                    reject(new ApiError('Invalid image type', 400));
                }
                resolve(result);
              }
            });
          }
        }
      );
    });
  }
};
module.exports = {
  uploadToCloudinary,
  deleteImageFromCloudinary,
  uploadAndSaveImageToCloudinary,
}
