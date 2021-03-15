const express = require("express");
const cors = require("cors");
const router = require("./controller.js");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.listen(5000, () => {
  console.log("Application started on port 5000");
});
