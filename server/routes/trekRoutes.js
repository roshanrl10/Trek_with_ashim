const express = require('express');
const router  = express.Router();

// Import all controller functions
const {
  getTreks,
  getTrekBySlug,
  getAllTreksAdmin,
  createTrek,
  updateTrek,
  addTrekImages,
  deleteTrek,
} = require('../controllers/trekController');

// Import middleware
const { protect, adminOnly }  = require('../middleware/authMiddleware');

// Import multer upload handlers from cloudinary config
const { uploadTrekPhoto } = require('../config/cloudinary');

// ─────────────────────────────────────────────
// PUBLIC ROUTES — no login needed
// ─────────────────────────────────────────────

// GET /api/treks → get all published treks (with optional filters)
router.get('/', getTreks);

// IMPORTANT: This admin route must come BEFORE /:slug
// Otherwise Express would think "admin" is a slug!
// GET /api/treks/admin/all → get all treks including drafts
router.get('/admin/all', protect, adminOnly, getAllTreksAdmin);

// GET /api/treks/everest-base-camp → get one trek by its slug
router.get('/:slug', getTrekBySlug);

// ─────────────────────────────────────────────
// PROTECTED ROUTES — must be logged in as admin
// protect runs first (checks token)
// adminOnly runs second (checks role)
// uploadTrekPhoto.single('coverImage') runs third (handles file upload)
// then the controller function runs last
// ─────────────────────────────────────────────

// POST /api/treks → create a new trek
router.post(
  '/',
  protect,
  adminOnly,
  uploadTrekPhoto.single('coverImage'), // handle one cover image upload
  createTrek
);

// PUT /api/treks/:id → update an existing trek
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadTrekPhoto.single('coverImage'),
  updateTrek
);

// POST /api/treks/:id/images → add extra photos to a trek
router.post(
  '/:id/images',
  protect,
  adminOnly,
  uploadTrekPhoto.array('images', 20), // handle up to 20 images at once
  addTrekImages
);

// DELETE /api/treks/:id → delete a trek
router.delete('/:id', protect, adminOnly, deleteTrek);

module.exports = router;