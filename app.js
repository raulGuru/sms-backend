const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/v1");

mongoose
  .connect(
    `mongodb+srv://mongouser:${process.env.MONGO_ATLAS_PW}@cluster0.znuv3.mongodb.net/smsrlocal?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

const app = express();
const port = 3200;

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//To allow cross-origin requests
app.use(cors());
app.options("*", cors());

// v1 api routes
app.use("/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
