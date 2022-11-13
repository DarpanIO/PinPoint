const fs= require('fs')
const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");
const app = express();

const port = 5000;
console.log("Server started at http://localhost:" + port);

app.use(bodyParser.json());
app.use('/uploads/images',express.static(path.join('uploads','images')))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept,Authorization ,Origin, X-Requested-With');
  next();
});
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path,(err)=>{
      console.log(err);
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

mongoose
  .connect(
    "mongodb+srv://darpan:darpan@cluster0.xcyayy8.mongodb.net/places?retryWrites=true&w=majority"
    // "mongodb://localhost:27017"
  )
  .then(() => {
    app.listen(port);
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
