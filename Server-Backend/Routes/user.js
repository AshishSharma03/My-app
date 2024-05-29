const express = require('express');
const Profile_User = require('../models/user');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to parse the request body
router.use(bodyParser.json({ limit: '50mb', extended: true }));
router.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send("Token not provided");
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.phoneNumber = decoded.phoneNumber;
    next();
  });
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await Profile_User.findById(phoneNumber);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ phoneNumber: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error");
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Profile_User({ ...userData, password: hashedPassword });

    await user.save();
    const token = jwt.sign({ phoneNumber: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).send(err);
  }
});

// Get all users
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await Profile_User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send(err);
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;
    const user = await Profile_User.findById(phoneNumber);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send("Password reset successfully");
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).send("Internal server error");
  }
});


// Get a user by phone number
router.get('/:phoneNumber', verifyToken, async (req, res) => {
  try {
    const user = await Profile_User.findById(req.params.phoneNumber);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send(err);
  }
});

// Update a user by phone number
router.put('/:phoneNumber', verifyToken, async (req, res) => {
  try {
    const user = await Profile_User.findByIdAndUpdate(req.params.phoneNumber, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).send(err);
  }
});

// Delete a user by phone number
router.delete('/:phoneNumber', verifyToken, async (req, res) => {
  try {
    const user = await Profile_User.findByIdAndDelete(req.params.phoneNumber);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send(err);
  }
});

// Update user's profile picture by phone number
router.put('/:phoneNumber/profile-picture', verifyToken,async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { profilePicture } = req.body;
    console.log(req.body)
    
    const user = await Profile_User.findOneAndUpdate(
      { _id: phoneNumber },
      { profilePicture },
      { new: true }
    );


    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});


module.exports = router;
