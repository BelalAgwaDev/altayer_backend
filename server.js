const express = require("express");
const socketIo = require('socket.io');
const http = require('http');

const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const mountRoutes = require("./routes");
const ApiError = require("./utils/apiError/apiError");
const globalError = require("./middleware/errorMiddleware");
const {
 addDriverSocket,removeDriverSocket
} = require('./services/orderServices/driverSocketUtils'); 




dotenv.config({ path: "config.env" });

//connect with db
dbConnection();


//connection with cloudinary 
cloudinaryConfig();

//express app
const app = express();


//socket Server
const serverSocket = http.createServer(app);

const io = socketIo(serverSocket);

//socket server using to send notification to driver
io.on('connection', (socket) => {
  console.log('A driver connected');

  socket.on('registerDriver', (driverId) => {
    socket.driverId = driverId;
    addDriverSocket(driverId, socket); 
    console.log(`Driver ${driverId} registered`);
  });

  socket.on('disconnect', () => {
    console.log('A driver disconnected');
    if (socket.driverId) {
      removeDriverSocket(socket.driverId); 
      console.log(`Driver ${socket.driverId} unregistered`);
    }
  });
});


//Middleware
// for parsing application/json
app.use(express.json());

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"uploads")))


if (process.env.NODE_ENV === "development") {
  //request logger middleware
  app.use(morgan("dev"));
  console.log(process.env.NODE_ENV);
}

//Mount Routes
mountRoutes(app);

//Route error middleware
app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 404));
});

//Global error handling middleware for express
app.use(globalError);

//node server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`App Running In This Port .`);
});



//Events (handling Rejection error outside express ) ---out express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name}  | ${err.message}`);
  server.close(() => {
    console.error(`server shutting down .....`);
    process.exit(1);
  });
});
