const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ApiError = require("../../../utils/apiError/apiError");

const storeModel = require("../../../modules/storeModel");

// @desc Get all stores around the user with their status and filter by category
// @route GET /api/v1/store/
// @access Protected/User
exports.getAllStoreNearbyInUser = asyncHandler(async (req, res, next) => {
  const { latitude, longitude, maxDistance, category } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      status: false,
      message: "Latitude and Longitude are required",
    });
  }
  const distanceInMeters = maxDistance ? maxDistance * 1000 : 5000; // Default 5km if not specified



  const stores = await storeModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        distanceField: "distance",
        maxDistance: distanceInMeters,
        spherical: true,
        key: "StoreAddress.location",
      },
    },
    {
      $match: {
        category: new mongoose.Types.ObjectId(category),
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "store",
        as: "reviews",
      },
    },
    { $limit: 20 },
  ]);

  const storesWithStatus = stores.map((store) => {
    const storeDoc = storeModel(store);
    const storeObj = storeDoc.toObject({ virtuals: true });
    storeObj.status = storeDoc.storeStatus;
    return storeObj;
  });

  // Sort storesWithStatus by status
  storesWithStatus.sort((a, b) => {
    // Assuming status is a string with values 'open', 'busy', 'closed'
    const statusOrder = { open: 1, busy: 2, closed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Send success response
  res.status(201).json({
    status: true,
    message: "Success to get all stores",
    data: storesWithStatus,
  });
});

// @desc check if there are store near the user or not
// @route GET /api/v1/store/check
// @access Protected/User
exports.checkNearbyUserStore = asyncHandler(async (req, res, next) => {
  const { latitude, longitude, maxDistance } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      status: false,
      message: "Latitude and Longitude are required",
    });
  }

  const maxDist = maxDistance ? parseFloat(maxDistance) : 5000; // Default 5km if not specified

  const stores = await storeModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        distanceField: "distance",
        maxDistance: maxDist,
        spherical: true,
        key: "StoreAddress.location",
      },
    },
  ]);

  if (!stores) {
    //send faild response
    return next(new ApiError(`out of delivery zone ,adjust the location`, 404));
  }

  // Send success response
  res.status(201).json({
    status: true,
    message: "your order will be delivered here",
  });
});
