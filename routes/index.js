const categoryRoute = require("./categoryRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const subCategoryRoute = require("./subCategoryRoute");
const addressRoute = require("./userAddressRoute");
const addressStoreRoute = require("./addressStoreRoute");
const storeRoute = require("./StoreRoute");
const productRoute = require("./productRoute");
const reviewRoute = require("./reviewRoute");




const mountRoute = (app) => {
    app.use("/v1/api/categories", categoryRoute);
    app.use("/v1/api/subCategories", subCategoryRoute);
    app.use("/v1/api/user", userRoute);
    app.use("/v1/api/auth", authRoute);
    app.use("/v1/api/address", addressRoute);
    app.use("/v1/api/store/address", addressStoreRoute);
    app.use("/v1/api/reviews", reviewRoute);
    app.use("/v1/api/store", storeRoute);
    app.use("/v1/api/product", productRoute);
  };
  


  module.exports = mountRoute;