const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("mongoDB connection successful");
});

connection.on("error", (err) => {
  console.log("mongoDB connection error", err);
});
