// const multer = require("multer");
// const ApiError = require("../utils/apiError/apiError");

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;


  
// const multerOption=()=>{
//     const multerStorage = multer.memoryStorage();
//     //memory storage
//   const multerFilter = function (req, file, cb) {
    
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb(new ApiError("only images are allowed", 400), false);
//     }
//   };
  
//   const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  
//   return upload
//   }
  
  
// const uploadSingleImage=(fieldName)=> multerOption().single(fieldName);
  
  
  
  
// const uploadListOfImage=(arryOfFields)=> multerOption().fields(arryOfFields);


//   module.exports={uploadSingleImage,uploadListOfImage}



const uploadImage = async (imagePath) => {

  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};




 module.exports={uploadImage}