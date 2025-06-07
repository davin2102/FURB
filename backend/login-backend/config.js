const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/Login-Signup');

// check database coonected or not
connect.then(() => {
    console.log("Connected to the database successfully");
}).catch(() => {
    console.error("Database connection failed:", err);
});

// create a schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("users", userSchema);

module.exports = { collection};