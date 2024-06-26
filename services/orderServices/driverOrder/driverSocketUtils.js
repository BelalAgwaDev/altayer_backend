const DriverModel = require("../../../modules/driverModel");

// In this example, we use a Map to store WebSocket connections for drivers
const driverSockets = new Map();

// Function to add a WebSocket connection for a driver
const addDriverSocket = (driverId, socket) => {
  driverSockets.set(driverId, socket);
};

// Function to remove a WebSocket connection for a driver
const removeDriverSocket = (driverId) => {
  driverSockets.delete(driverId);
};

// Function to get the WebSocket connection for a driver based on driverId
const getDriverSocketById = (driverId) => driverSockets.get(driverId) || null;



//send notification to driver
const sendNotificationToDriver = (driverId, message) => {
  const driverSocket = getDriverSocketById(driverId);
  if (driverSocket) {
    driverSocket.emit("newOrder", { message });
  }
};


//find all avaliable drivers about order
const findAvailableDrivers = async (orderLocation) => {
  const drivers = await DriverModel.find({
    status: "Active",
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [orderLocation.longitude, orderLocation.latitude],
        },
        $maxDistance: 5000,
      },
    },
  });

  return drivers;
};



module.exports = {
  addDriverSocket,
  removeDriverSocket,
  getDriverSocketById,
  sendNotificationToDriver,
  findAvailableDrivers
};