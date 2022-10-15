const express = require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });


const userRoutes = require('./routes/user.routes');

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@clusteralodok.begiaw9.mongodb.net/alodok-mern?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Koneksyon a MongoDB reyisi !"))
  .catch(() => console.log("Koneksyon a MongoDB echwe !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use('/api/user', userRoutes);

module.exports = app;
