const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/Login-Signup');

// check database coonected or not
connect.then(() => {
    console.log("Connected to the database successfully");
}).catch(() => {
    console.error("Database connection failed:", err);
});

// create a schema
const itemSchema = new mongoose.Schema({
    
});

const collection = mongoose.model("items", itemSchema);

module.exports = { collection};