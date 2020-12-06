const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const port = process.env.PORT || 3001;

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function () {
    console.log("Connected to db");
  }
);

app.use(express.json());
app.use(cors());
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

app.listen(port, function () {
  console.log(`Started on port ${port}`);
});
