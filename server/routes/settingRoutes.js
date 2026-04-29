const express = require('express');
const router  = express.Router();
const {
  getSettings, updateSettings,
  getAbout, updateAbout,
  uploadSettingsImage,
} = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Settings
router.get('/settings', getSettings);
router.put(
  '/settings',
  protect, adminOnly,
  uploadSettingsImage.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'ctaImage',  maxCount: 1 },
  ]),
  updateSettings
);

// About
router.get('/about', getAbout);
router.put(
  '/about',
  protect, adminOnly,
  uploadSettingsImage.single('profileImage'),
  updateAbout
);

module.exports = router;