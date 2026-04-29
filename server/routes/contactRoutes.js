const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/contact — public, save message to DB
router.post('/', async (req, res) => {
  const { name, email, message, phone, trekInterest } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  const contact = await Contact.create({ name, email, phone, trekInterest, message });
  res.json({ message: 'Message received! Ashim will get back to you soon.', id: contact._id });
});

// GET /api/contact — admin only, get all messages
router.get('/', protect, adminOnly, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

// PATCH /api/contact/:id/read — mark as read
router.patch('/:id/read', protect, adminOnly, async (req, res) => {
  const msg = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  res.json(msg);
});

// PATCH /api/contact/:id/replied — mark as replied
router.patch('/:id/replied', protect, adminOnly, async (req, res) => {
  const msg = await Contact.findByIdAndUpdate(
    req.params.id,
    { isReplied: true, isRead: true },
    { new: true }
  );
  res.json(msg);
});

// DELETE /api/contact/:id — delete message
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;