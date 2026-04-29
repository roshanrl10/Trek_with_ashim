const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true },
    phone:        String,
    trekInterest: String,
    message:      { type: String, required: true },

    // Has Ashim read this message?
    isRead: { type: Boolean, default: false },

    // Has Ashim replied?
    isReplied: { type: Boolean, default: false },
  },
  { timestamps: true } // createdAt tells us when message was sent
);

module.exports = mongoose.model('Contact', contactSchema);