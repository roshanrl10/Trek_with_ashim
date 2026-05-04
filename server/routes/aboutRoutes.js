const express = require('express');
const router  = express.Router();
const { getAbout, updateAbout, uploadSettingsImage } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAbout);
router.put('/', protect, adminOnly,
  uploadSettingsImage.single('profileImage'),
  updateAbout
);

module.exports = router;