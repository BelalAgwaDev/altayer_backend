const asyncHandler = require("express-async-handler");
const storeModel = require("../../../modules/storeModel");



// @ dec add  busy time to store
// @ route Post  /api/vi/store/busyTime/:id
// @ access protected/StoreOwner

exports.addBusyTimeToStore = asyncHandler(async (req, res, next) => {
  const { start, end } = req.body;
  const { id } = req.params;
  const document = await storeModel.findOneAndUpdate(
    { _id: id},
    {
      $addToSet: {
        
          busyHours: { start, end },
        
      },
    },
    {
      new: true,
    }
  );

  //send success response
  res.status(201).json({
    status: true,
    message: `Busy hour added successfully to store`,
    data: document,
  });
});






// @ dec remove  busy time to store
// @ route delete  /api/vi/store/busyTime/:id
// @ access protected/StoreOwner

exports.removeBusyTimeToStore = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await storeModel.findOneAndUpdate(
    { _id: id},
    {
      $pull: {
        busyHours: { _id: req.body.busyHoursId }, 
      },
    },
    {
      new: true,
    }
  );

  //send success response
  res.status(201).json({
    status: true,
    message: `Busy hour removed successfully to store`,
    data: document,
  });
});




// @ dec getAll store busy time  
// @ route delete  /api/vi/store/busyTime/:id
// @ access protected/StoreOwner

exports.getAllStoreBusyTime = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const document = await storeModel
    .find({_id: id}, 'busyHours')
 

  //send success response
  res.status(201).json({
    status: true,
    message: `Sucess to get all address to store`,
    data: document,
  });
});


