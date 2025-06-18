const mongoose = require("mongoose");

// Replace with your actual connection string
const uri =
  "mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/furb-items?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
