const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const userModel = require("../modules/userModel");
const resizeImage = require("../middleware/resizeImage");
const { uploadSingleImage } = require("../middleware/imageUploadMiddleware");
const {deleteImage} = require("../utils/deleteImage/deleteImage");
const creatToken = require("../utils/generate token/createToken");
const ApiError = require("../utils/apiError/apiError");
const factory = require("./handlerFactory");

//upload single image
const uploadUserImage = uploadSingleImage("image");

// rssize image before upload
const resizeUserImage = resizeImage("user");

// @ dec creat User
// @ route Post  /api/vi/user
// @ access private
const creatUser = factory.creatOne(userModel, "User");

// @ dec get all  User data
// @ route Get  /api/vi/ser
// @ access private
const getAllUser = factory.getAllData(userModel, "User");

// @ dec get specific User
// @ route Get  /api/vi/user/id
// @ access private
const getOneUser = factory.getOne(userModel, "User");

// @ dec update specific User
// @ route Update  /api/vi/user/id
// @ access Private
const updateUser = asyncHandler(async (req, res, next) => {
  //update all data with out password
  //this code update data from db using id
  const document = await userModel.findOne(req.params._id);

  //check found data or no
  if (!document) {
    //send faild response
    return next(new ApiError(`Faild To get User data from this id ${req.params._id}`, 404));
  }

  if (document.image) {
    //delete old image
    deleteImage(req, document);
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
    message: `Sucess To Update User data from this id`,
    data: document,
  });
});
// @ dec update  User Password
// @ route Update  /api/vi/user/changePassword/id
// @ access private
const updateUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`Faild To get User data from this id ${id}`, 404));
  }

  res.status(200).json({
    status: true,
    message: `Sucess To Update User data from this id`,
    data: document,
  });
});

// @ dec delete specific User
// @ route Update  /api/vi/user/id
// @ access Private
const deleteUser = factory.deleteOne(userModel, "User");

// @ dec delete specific User
// @ route Update  /api/vi/user/id
// @ access Private
const deleteAllUser = factory.deleteAll(userModel, "User");

// @ dec get logged user data
// @ route get  /api/vi/user/getMe
// @ access private/protect
const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.userModel._id;
  next();
});


// @ dec add logged user data in body
// @ access private/protect
const addLoggedUserDataInBody = asyncHandler(async (req, res, next) => {
  req.body.id = req.userModel._id;
  next();
});

// @ dec update logged user password
// @ route Update  /api/vi/user/updateMyPassword
// @ access private/protect
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //update user password based user payload
  const document = await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  //generate token
  const token = creatToken( req.userModel._id);

  res.status(200).json({
    status: true,
    message: `Sucess To Update User password from this id`,
    token: token,
    data: document,
  });
});

// @ dec update logged user data
// @ route Update  /api/vi/user/updateMyData
// @ access private/protect
const updateLoggedUserData = asyncHandler(async (req, res, next) => {

  //update user data based user payload
  const document = await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: `Sucess To Update User data from this id`,
    data: document,
  });
});

// @ dec update logged user image
// @ route Update  /api/vi/user/updateMyImage
// @ access private/protect
const updateLoggedUserImage = asyncHandler(async (req, res, next) => {
  //update user data based user payload
  const document = await userModel.findOne(req.userModel._id);

  if (document.image) {
    //delete old image
    deleteImage(req, document);
  }

  document.image = req.body.image;
  await document.save();

  res.status(200).json({
    status: true,
    message: `Sucess To Update User image from this id.....`,
    data: document,
  });
});

// @ dec delete logged user
// @ route Update  /api/vi/user/deleteMe
// @ access private/protect
const deleteLoggedUser = asyncHandler(async (req, res, next) => {
  //delete user  based user payload

  await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      active: false,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: true,
    message: `Sucess To delete User  from this id`,
  });
});

module.exports = {
  creatUser,
  getAllUser,
  getOneUser,
  getLoggedUserData,
  updateUser,
  updateLoggedUserImage,
  updateUserPassword,
  updateLoggedUserData,
  updateLoggedUserPassword,
  addLoggedUserDataInBody,
  deleteUser,
  deleteAllUser,
  deleteLoggedUser,
  uploadUserImage,
  resizeUserImage,
};
