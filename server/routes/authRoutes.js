// express.Router() creates a mini-app that handles a group of routes
const express = require('express');
const router = express.Router();

// Import our controller functions
const { register, login, getMe } = require('../controllers/authController');

// Import our middleware
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────
// PUBLIC ROUTES — no token needed
// ─────────────────────────────────────────────

// POST /api/auth/register → runs the register function
router.post('/register', register);

// POST /api/auth/login → runs the login function
router.post('/login', login);

// ─────────────────────────────────────────────
// PROTECTED ROUTES — must send a valid token
// "protect" middleware runs first, then getMe
// ─────────────────────────────────────────────

// GET /api/auth/me → runs protect first, then getMe
router.get('/me', protect, getMe);

module.exports = router;