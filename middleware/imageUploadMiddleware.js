const multer = require("multer");
const ApiError = require("../utils/apiError/apiError");




// //disk storage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     //null == no error , destination == path to save image(folder)
//     callback(null, "uploads/categories");
//   },
//   //change image name
//   filename: function (req, file, callback) {
//     //category-${id}-date.now().jpeg
//     const extension = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${extension}`;
//     // null ==no error filename ==path to (file $$ image )

//     callback(null, filename);
//   },
// });




  
const multerOption=()=>{
    const multerStorage = multer.memoryStorage();
    //memory storage
  const multerFilter = function (req, file, cb) {
    
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images are allowed", 400), false);
    }
  };
  
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  
  return upload
  }
  
  
const uploadSingleImage=(fieldName)=> multerOption().single(fieldName);
  
  
  
  
const uploadListOfImage=(arryOfFields)=> multerOption().fields(arryOfFields);


  module.exports={uploadSingleImage,uploadListOfImage}