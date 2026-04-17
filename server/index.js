// express is the main framework for building our server
const express = require('express');

// cors allows our React app (running on port 5173) to talk to this server (port 5000)
// Without this, the browser blocks requests between different ports — it's a security feature
const cors = require('cors');

// dotenv reads our .env file and makes those values available via process.env
const dotenv = require('dotenv');

// Our database connection function
const connectDB = require('./config/db');

// Load the .env file — must be called before anything else uses process.env
dotenv.config();

// Connect to MongoDB
connectDB();

// Create the Express application
const app = express();

// MIDDLEWARE — code that runs on every single request before it reaches the route

// Allow requests from our React frontend
app.use(cors({
  origin: process.env.CLIENT_URL, // only allow requests from our frontend URL
  credentials: true
}));

// Allow the server to understand JSON data sent in requests
// Without this, req.body would always be undefined
app.use(express.json());

// Allow the server to understand form data
app.use(express.urlencoded({ extended: true }));

// ROUTES — we'll connect these files one by one as we build them
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/treks', require('./routes/trekRoutes'));
// app.use('/api/gallery', require('./routes/galleryRoutes'));
// app.use('/api/posts', require('./routes/postRoutes'));

// A simple test route — visiting http://localhost:5000 should show this message
app.get('/', (req, res) => {
  res.json({ message: '🏔️ Trek with Ashim API is running!' });
});

// ERROR HANDLER — if anything crashes, this catches it and sends a clean error message
// The "err" parameter is only passed when something calls next(error)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong on the server'
  });
});

// Read the PORT from .env file, or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start listening — the server is now "on" and waiting for requests
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});