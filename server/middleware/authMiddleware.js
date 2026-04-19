// jwt lets us verify the token
const jwt = require('jsonwebtoken');

// We need the User model to find the user by their ID stored in the token
const User = require('../models/user');

// ─────────────────────────────────────────────
// MIDDLEWARE 1: protect
// This runs before any route that requires login
// It checks if a valid token was sent with the request
// ─────────────────────────────────────────────
const protect = async (req, res, next) => {

  // Tokens are sent in the request "headers" under "Authorization"
  // The format is: "Bearer eyJhbGci..."
  // req.headers.authorization looks like: "Bearer eyJhbGci..."
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Split "Bearer eyJhbGci..." by the space and take the second part
    token = req.headers.authorization.split(' ')[1];
  }

  // If there's no token at all, block the request immediately
  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    // jwt.verify does two things:
    // 1. Checks that the token was created with our secret key (not fake)
    // 2. Decodes it and returns the payload — in our case { id: "userId123" }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the ID from the token
    // .select('-password') means: get everything EXCEPT the password field
    req.user = await User.findById(decoded.id).select('-password');

    // "next()" means: token is valid, continue to the actual route
    next();

  } catch (error) {
    // If the token is expired, fake, or broken — block the request
    res.status(401).json({ message: 'Not authorized — token failed' });
  }
};

// ─────────────────────────────────────────────
// MIDDLEWARE 2: adminOnly
// This runs AFTER protect — it checks if the logged-in user is an admin
// Some routes (like adding a trek) should only be accessible by Ashim
// ─────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  // req.user was set by the protect middleware above
  if (req.user && req.user.role === 'admin') {
    // User is an admin — let them through
    next();
  } else {
    // User is logged in but not admin — block them
    res.status(403).json({ message: 'Access denied — admin only' });
  }
};

// Export both so routes can use them
module.exports = { protect, adminOnly };