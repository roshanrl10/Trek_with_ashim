const express = require('express');
const router  = express.Router();

const {
  getGallery,
  getFeatured,
  uploadMedia,
  updateMedia,
  deleteMedia,
} = require('../controllers/galleryController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadGallery }      = require('../config/cloudinary');

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────

// GET /api/gallery → all gallery items (with optional filters)
router.get('/', getGallery);

// GET /api/gallery/featured → featured items for homepage
// Must come BEFORE /:id so Express doesn't treat "featured" as an ID
router.get('/featured', getFeatured);

// ─────────────────────────────────────────────
// PROTECTED ROUTES (admin only)
// ─────────────────────────────────────────────

// POST /api/gallery → upload multiple photos/videos
// uploadGallery.array('media', 30) → accept up to 30 files with field name 'media'
router.post(
  '/',
  protect,
  adminOnly,
  uploadGallery.array('media', 30),
  uploadMedia
);

// PATCH /api/gallery/:id → update caption, tags etc
router.patch('/:id', protect, adminOnly, updateMedia);

// DELETE /api/gallery/:id → delete one item
router.delete('/:id', protect, adminOnly, deleteMedia);

module.exports = router;