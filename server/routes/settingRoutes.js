const express = require('express');
const router  = express.Router();
const { getSettings, updateSettings, uploadSettingsImage } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/', protect, adminOnly,
  uploadSettingsImage.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'ctaImage',  maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;