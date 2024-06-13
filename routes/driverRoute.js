const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  updateDriverStatus,
} = require("../services/driverServices/updateDriverStatus");

const {
  updateDriverLocation,
} = require("../services/driverServices/updateDriverLocation");
const {
  creatDriver,
  deleteDriver,
  getAllDriver,
  getOneDriver,
} = require("../services/driverServices/driverService");

const {
  updateDriverData,
} = require("../services/driverServices/updateDriverData");

const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("driver", "admin"));

router
  .route("/")
  .post(creatDriver)
  .put(updateDriverData)
  .get(authServices.allowedTo("admin"), getAllDriver);

router
  .route("/:id")
  .get(getOneDriver)
  .delete(authServices.allowedTo("admin"), deleteDriver);
router.route("/status").put(updateDriverStatus);
router.route("/location").put(updateDriverLocation);

module.exports = router;
