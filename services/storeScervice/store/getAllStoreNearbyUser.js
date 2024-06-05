const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const storeModel = require('../../../modules/storeModel')

// @desc Get all stores around the user with their status and filter by category
// @route GET /api/v1/store/
// @access Protected/User
exports.getAllStoreNearbyInUser = asyncHandler(async (req, res, next) => {
  const { latitude, longitude, maxDistance, category } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      status: false,
      message: 'Latitude and Longitude are required',
    });
  }

  const maxDist = maxDistance ? parseFloat(maxDistance) : 5000; // Default 5km if not specified

  const stores = await storeModel.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
        distanceField: 'distance',
        maxDistance: maxDist,
        spherical: true,
        key: 'StoreAddress.location'

      },
    },
    {
      $match: {
        category: new mongoose.Types.ObjectId(category),
      },
    },
    { $limit: 10 }
  ]);



  const storesWithStatus = stores.map(store => {
    const storeDoc =  storeModel(store);
    const storeObj = storeDoc.toObject({ virtuals: true });
    storeObj.status = storeDoc.storeStatus;  
    return storeObj;
  });
  // Send success response
  res.status(201).json({
     status: true,
    message: 'Success to get all stores',
    data: storesWithStatus,
  });
});