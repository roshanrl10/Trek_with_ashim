const express = require('express');
const router  = express.Router();

// POST /api/contact
// Public — anyone can send a message
router.post('/', async (req, res) => {
  const { name, email, message, phone } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  // For now just log it — later we can add nodemailer to send emails
  console.log('📩 New contact message:');
  console.log(`From: ${name} (${email})`);
  console.log(`Phone: ${phone || 'not provided'}`);
  console.log(`Message: ${message}`);

  res.json({ message: 'Message received! Ashim will get back to you soon.' });
});

module.exports = router;