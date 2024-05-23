const asyncHandler = require("express-async-handler");
const userModel = require("../../modules/userModel");
const ApiError = require("../../utils/apiError/apiError");
const {
  deleteImageFromCloudinary,
} = require("../../middleware/cloudinaryMiddleWare");

// @ dec update specific User
// @ route Update  /api/vi/user/id
// @ access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  //update all data with out password
  //this code update data from db using id
  const document = await userModel.findOne(req.params._id);

  //check found data or no
  if (!document) {
    //send faild response
    return next(
      new ApiError(`Faild To get User data from this id ${req.params._id}`, 404)
    );
  }

  if (document.image) {
    //delete old image
    deleteImageFromCloudinary(document.publicId);
  }

  if (req.body.name) {
    document.name = req.body.name;
  }
  if (req.body.email) {
    document.email = req.body.email;
  }

  document.phone = req.body.phone;
  document.image = req.body.image;
  document.role = req.body.role;
  document.active = req.body.active;

  await document.save();

  //send success respons
  res.status(200).json({
    status: true,
    message: `Sucess To Update User data `,
    data: document,
  });
});
