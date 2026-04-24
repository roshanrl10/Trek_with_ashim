const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ─────────────────────────────────────────────
// HELPER: generateToken
// Creates a JWT token containing the user's ID
// This token expires in 7 days — after that they need to log in again
// ─────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign(
    { id },                        // the payload — what's stored inside the token
    process.env.JWT_SECRET,        // the secret key from .env — keeps tokens secure
    { expiresIn: '7d' }            // token expires after 7 days
  );
};

// ─────────────────────────────────────────────
// REGISTER — POST /api/auth/register
// Creates a new user account
// ─────────────────────────────────────────────
const register = async (req, res) => {
  // req.body contains the data sent from the frontend
  // e.g. { name: "Ashim", email: "ashim@gmail.com", password: "mypassword" }
  const { name, email, password } = req.body;

  // Check if a user with this email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  // Create the user — the password gets hashed automatically
  // because of the pre('save') middleware we wrote in the User model
  const user = await User.create({ name, email, password });

  // Send back the user info and a token
  // We never send the password — not even the hashed version
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// ─────────────────────────────────────────────
// LOGIN — POST /api/auth/login
// Checks credentials and returns a token
// ─────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  // We need to include the password here for comparison (normally it's excluded)
  const user = await User.findOne({ email });

  // Check two things:
  // 1. Does a user with this email exist?
  // 2. Does the entered password match the stored hash?
  // user.matchPassword is the method we defined in User.js
  if (!user || !(await user.matchPassword(password))) {
    // Deliberately vague message — don't tell hackers which one is wrong
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Credentials are correct — send back user info and a fresh token
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// ─────────────────────────────────────────────
// GET ME — GET /api/auth/me
// Returns the currently logged-in user's info
// Used by the frontend to check "am I still logged in?"
// This route is protected — you must send a valid token
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user was set by the protect middleware
  // It already contains the full user object (minus password)
  res.json(req.user);
};

module.exports = { register, login, getMe };