const asyncHandler = require("express-async-handler");
const userModel = require("../../modules/userModel");

const {
  deleteImageFromCloudinary,
} = require("../../middleware/cloudinaryMiddleWare");

// @ dec update logged user image
// @ route Update  /api/vi/user/updateMyImage
// @ access private/protect
exports.updateLoggedUserImage = asyncHandler(async (req, res, next) => {
  //update user data based user payload
  const document = await userModel.findOne(req.userModel._id);

  if (document.image) {
    //delete old image
    deleteImageFromCloudinary(document.publicId);
  }

  document.image = req.body.image;
  await document.save();

  res.status(200).json({
    status: true,
    message: `Sucess To Update User image from this id.....`,
    data: document,
  });
});
