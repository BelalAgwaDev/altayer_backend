const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const ApiError = require("../utils/apiError/apiError");

const deleteImageFromCloudinary = (publicId) =>
  asyncHandler(async (req, res) => {
    await cloudinary.uploader.destroy(publicId);
  });

const uploadToCloudinary = () =>
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new ApiError(`'No file uploaded.'`, 404));
    }
    const filePath = path.join(req.body.imageUrl);

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
                cb(new ApiError("only images are allowed", 400), false);
              } else {
                req.body.image = result.url;
                req.body.publicId = result.publicId;
                next();
              }
            });
          } else {
            fs.unlink(filePath, () => {});

            return next(new ApiError("upload image error try again", 400));
          }
        }
      );
    }
  });

module.exports = { uploadToCloudinary, deleteImageFromCloudinary };
