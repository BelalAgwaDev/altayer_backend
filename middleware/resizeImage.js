const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

//image processing
const resizeImage = (directorName) =>
  asyncHandler(async (req, res, next) => {
    //create path to image
    const filename = `${directorName}-${uuidv4()}-${Date.now()}.jpeg`
    const directorPath = `uploads/${directorName}`
    const filePath = `${directorPath}/${filename}`

    // Ensure the directory exists
    if (!fs.existsSync(path.join('uploads', directorName))) {
      fs.mkdirSync(path.join('uploads', directorName), { recursive: true })
    }

    if (req.file) {
      //processing in image before uploade

      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(filePath)

      //save image into our database
      req.body.image = filename
      // req.body.image = filename;
      req.body.directorUrl = directorPath
      req.body.imageUrl = filePath
    }
    next()
  })



const resizeAndSaveImage = async (file, directorName, imageType, req) => {
  // Create path to image

  const filename = `${directorName}-${uuidv4()}-${Date.now()}.jpeg`
  const directorPath = `uploads/${directorName}`
  const filePath = `${directorPath}/${filename}`

  // Ensure the directory exists
  if (!fs.existsSync(path.join('uploads', directorName))) {
    fs.mkdirSync(path.join('uploads', directorName), { recursive: true })
  }


    // Processing image before uploading
    await sharp(file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(filePath)

    // Save image information into the request body
    switch (imageType) {
      case 'image':
        req.body.image = filename
        break
      case 'storeCoverImage':
        req.body.storeCoverImage = filename
        break
      case 'storeLogoImage':
        req.body.storeLogoImage = filename
        break
      default:
        throw new Error('Invalid image type')
    }

    req.body.directorUrl = directorPath
    return { directorPath, filePath ,imageType}
  }


module.exports = { resizeAndSaveImage, resizeImage }
