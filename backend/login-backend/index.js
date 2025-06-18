const express = require('express');
const pasth = require("path");
const bcrypt = require("bcrypt");
const { collection} = require('./config');
const { homedir } = require('os');
const cors = require('cors');


const app = express();

// convert data to json
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('API is running');
});

app.get('/signup', (req, res) => {
    res.send('Signup endpoint');
});

// register user
app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, dob, gender, bio, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.send("Passwords do not match.");
        return;
    }

    const data = {
        firstName,
        lastName,
        email,
        dob,
        gender,
        bio,
        password
    };

    // check if user already exists
    const existingUser = await collection.findOne({ email: data.email });
    if(existingUser){
        res.send("User already exists. Please choose a different email.");
    } else {
        // hash the password
        const saltrounds = 10;
        const hashpassword = await bcrypt.hash(data.password, saltrounds);
        data.password = hashpassword;
        // send data to database
        const userdata = await collection.create(data);
        console.log(userdata);
        res.send("Signup successful!");
    }
});

// login user
app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if(!check){
            res.send("User not found. Please sign up.");
            return;
        }
        // compare the hashed password with the entered password
        const isMatch = await bcrypt.compare(req.body.password, check.password);
        if(isMatch){
            res.json({ message: "Login successful!" });
        } else {
            res.send("Invalid password. Please try again.");
        }
    } catch {
        res.send("Wrong details. Please try again.");
    }
});

// Get user profile by email
app.get('/profile', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio || '',
            birthDate: user.dob ? user.dob.toISOString().split('T')[0] : '',
            email: user.email,
            gender: user.gender || ''
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
app.post('/profile', async (req, res) => {
    const { email, firstName, lastName, bio, birthDate, gender } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const updated = await collection.findOneAndUpdate(
            { email },
            {
                $set: {
                    firstName,
                    lastName,
                    bio,
                    dob: birthDate,
                    gender
                }
            },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, user: updated });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Change password endpoint
app.post('/change-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await collection.updateOne({ email }, { $set: { password: hashedPassword } });
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})