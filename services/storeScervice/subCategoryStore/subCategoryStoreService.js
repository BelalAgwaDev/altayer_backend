const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");

  //////////////////////////////////////////
  ///////////////////////
  ////////////////////////////////////////
// @ dec remove subCategory to store
// @ route delete  /api/vi/store/SubCategory/:subCategoryId
// @ access protected/StoreOwner

const removeSubCategoryFromStore = asyncHandler(async (req, res, next) => {

    const document = await storeModel.findOneAndUpdate(
      { user: req.userModel._id },
      {
        $pull: {
            subCategory: req.params.subCategoryId,
        },
      },
      {
        new: true,
      }
    );
  
    //send success response
    res.status(201).json({
      status: true,
      message: `sub Category removed successfully from store `,
      data: document,
    });
  });

    //////////////////////////////////////////
  ///////////////////////
  ////////////////////////////////////////
  
  // @ dec add SubCategory to store
  // @ route Post  /api/vi/store/SubCategory
  // @ access protected/StoreOwner
  
  const addSubCategoryToStore = asyncHandler(async (req, res, next) => {

    const document = await storeModel.findOneAndUpdate(
      { user: req.userModel._id },
      {
        $addToSet: {
            subCategory:req.body.subCategoryId, 
        },
      }
    );
  
    //send success response
    res.status(201).json({
      status: true,
      message: `Sucess to add subCategory to store`,
      data: document,
    });
  });

  //////////////////////////////////////////
  ///////////////////////
  ////////////////////////////////////////
  // @ dec get all SubCategory to store
  // @ route get  /api/vi/store/SubCategory
  // @ access protected/StoreOwner
  const getStoreSubCategory = asyncHandler(async (req, res, next) => {

    const document = await storeModel.findById({ user: req.userModel._id }).populate("subCategory");
  
    //send success response
    res.status(201).json({
      status: true,
      message: `Sucess to get all sub Category to store`,
      data: document,
    });
  });




  
  


  module.exports = {
    getStoreSubCategory,
    addSubCategoryToStore,
    removeSubCategoryFromStore,

  };
  