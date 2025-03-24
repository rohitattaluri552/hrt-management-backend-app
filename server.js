const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = "mongodb://localhost:27017/auth-demo";
const MONGOOSE_STRING =
  "mongodb+srv://hrtsainirman:<hrtsainirman>@apartment-management.hvndh.mongodb.net/?retryWrites=true&w=majority&appName=apartment-management";
const MONGODB_COMPASS =
  "mongodb+srv://hrtsainirman:<db_password>@apartment-management.hvndh.mongodb.net/";
mongoose
  .connect(MONGODB_COMPASS)
  .then((result) => {
    console.log("connected to Mongodb", result);
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(8800, () => {
  console.log("backend server is running!!!");
});
