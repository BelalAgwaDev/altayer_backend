const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const {
  deleteImage,
  deleteImagesInFolder,
} = require("../utils/deleteImage/deleteImage");

//@dec this function used to  create in mongo db
const creatOne = (model, modelName) =>
  asyncHandler(async (req, res) => {
    //this code to create
    const document = await model.create(req.body);
    //send success response
    res.status(201).json({
      status: true,
      message: `Successful ${modelName} creation`,
      data: document,
    });
  });

//@dec this function used to  get all data from mongo db
const getAllData = (model, modelName) =>
  asyncHandler(async (req, res) => {
    //this code get all data
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    const document = await model.find(filter);

    //check when no data found in db
    if (!document[0]) {
      // send success response
      return res.status(204).json({
        status: true,
        message: `There is no data entry for this ${modelName} `,
      });
    }

    // send success response with data
    res.status(200).json({
      status: true,
      message: `Sucess To get all ${modelName} data`,
      data: document,
    });
  });

//@dec this function used to  get one data from mongo db
const getOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //this code get one data from db using id
    const document = await model.findById(id);
    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get ${modelName} data from this id ${id}`, 404)
      );
    }
    //send success respons
    res.status(200).json({
      status: true,
      message: `Sucess To get ${modelName} data from this id`,
      data: document,
    });
  });

//@dec this function used to  update  data from mongo db
const updateOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    //this code update data from db using id
    const document = await model.findOneAndUpdate({ _id: id }, req.body);

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(`Faild To get ${modelName} data from this id ${id}`, 404)
      );
    }

    if (document.image) {
      //delete old image
      deleteImage(req, document);
    }

    //send success respons
    res.status(204).json({
      status: true,
      message: `Sucess To Update ${modelName} data from this id`,
    });
  });

//@dec this function used to  delete one  data from mongo db
const deleteOne = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const directorPath = `uploads/${modelName}`;

    //this code delete data from db using id
    const document = await model.findByIdAndDelete({ _id: id });

    //check found data or no
    if (!document) {
      //send faild response
      return next(
        new ApiError(
          `Faild To Delete ${modelName} data from this id ${id}`,
          404
        )
      );
    }

    req.body.directorUrl = directorPath;

    if (document.image) {
      //delete old image
      deleteImage(req, document);
    }

    //send success respons
    res.status(204).json({
      status: true,
      message: `Sucess To Delete ${modelName} data from this id`,
    });
  });

//@dec this function used to  delete   data from mongo db
const deleteAll = (model, modelName) =>
  asyncHandler(async (req, res, next) => {
    //this code delete all data
    await model.deleteMany();

    //delete all images
    deleteImagesInFolder(modelName);

    //send success respons
    res.status(204).json({
      status: true,
      message: `Sucess To Delete  all data from this ${modelName} `,
    });
  });

module.exports = {
  creatOne,
  getAllData,
  getOne,
  updateOne,
  deleteOne,
  deleteAll,
  deleteImage,
};
