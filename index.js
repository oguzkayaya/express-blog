const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function () {
    console.log("Connected to db");
  }
);

app.use(express.json());
app.use("/register", require("./routes/register"));

app.listen(3000, function () {
  console.log("Started on port 3000");
});
