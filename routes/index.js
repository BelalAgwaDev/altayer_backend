const categoryRoute = require("./categoryRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const subCategoryRoute = require("./subCategoryRoute");
const addressRoute = require("./addressRoute");



const mountRoute = (app) => {
    app.use("/v1/api/categories", categoryRoute);
    app.use("/v1/api/subCategories", subCategoryRoute);
    app.use("/v1/api/user", userRoute);
    app.use("/v1/api/auth", authRoute);
    app.use("/v1/api/address", addressRoute);
  };
  


  module.exports = mountRoute;