const Gallery = require('../models/Gallery');
const { cloudinary } = require('../config/cloudinary');

// ─────────────────────────────────────────────
// GET GALLERY — GET /api/gallery
// Public — anyone can view photos
// Optional filters: trek ID, tags, page number
// ─────────────────────────────────────────────
const getGallery = async (req, res) => {
  const { trek, tags, mediaType, page = 1, limit = 20 } = req.query;

  const query = {};

  // Filter by trek if provided: /api/gallery?trek=64abc123
  if (trek) query.trek = trek;

  // Filter by media type: /api/gallery?mediaType=video
  if (mediaType) query.mediaType = mediaType;

  // Filter by tags: /api/gallery?tags=sunrise,everest
  // $in means "where tags contains ANY of these values"
  if (tags) query.tags = { $in: tags.split(',') };

  const total = await Gallery.countDocuments(query);

  const items = await Gallery.find(query)
    // .populate() replaces the trek ID with the actual trek's title and slug
    // Without populate: trek: "64abc123"
    // With populate:    trek: { title: "Everest Base Camp", slug: "everest-base-camp" }
    .populate('trek', 'title slug')
    .sort({ takenAt: -1 }) // most recently taken photos first
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    items,
    total,
    page:  Number(page),
    pages: Math.ceil(total / limit),
  });
};

// ─────────────────────────────────────────────
// GET FEATURED — GET /api/gallery/featured
// Public — returns featured photos for homepage
// ─────────────────────────────────────────────
const getFeatured = async (req, res) => {
  const items = await Gallery.find({ isFeatured: true })
    .populate('trek', 'title slug')
    .sort({ createdAt: -1 })
    .limit(12); // only show 12 on homepage

  res.json(items);
};

// ─────────────────────────────────────────────
// UPLOAD MEDIA — POST /api/gallery
// Private — admin only
// Handles multiple files at once
// ─────────────────────────────────────────────
const uploadMedia = async (req, res) => {
  // req.files is an array of uploaded files (we use .array() in the route)
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // Create a Gallery document for each uploaded file
  // Promise.all runs all the creates at the same time — faster than one by one
  const items = await Promise.all(
    req.files.map(file =>
      Gallery.create({
        url:       file.path,         // Cloudinary URL
        publicId:  file.filename,     // Cloudinary ID (for deletion)

        // Detect if it's a video based on mimetype
        // file.mimetype looks like "image/jpeg" or "video/mp4"
        mediaType: file.mimetype?.startsWith('video') ? 'video' : 'photo',

        // Optional fields from request body
        trek:     req.body.trek     || null,
        location: req.body.location || '',
        caption:  req.body.caption  || '',

        // Tags come as a comma-separated string: "sunrise,everest,morning"
        // We split by comma and trim whitespace from each tag
        tags: req.body.tags
          ? req.body.tags.split(',').map(t => t.trim())
          : [],

        takenAt: req.body.takenAt || new Date(),
      })
    )
  );

  res.status(201).json(items);
};

// ─────────────────────────────────────────────
// UPDATE MEDIA — PATCH /api/gallery/:id
// Private — admin only
// Update caption, tags, location, isFeatured
// ─────────────────────────────────────────────
const updateMedia = async (req, res) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Parse tags if sent as comma-separated string
  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(t => t.trim());
  }

  const updated = await Gallery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

// ─────────────────────────────────────────────
// DELETE MEDIA — DELETE /api/gallery/:id
// Private — admin only
// Deletes from MongoDB AND from Cloudinary
// ─────────────────────────────────────────────
const deleteMedia = async (req, res) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Delete from Cloudinary first
  if (item.publicId) {
    await cloudinary.uploader.destroy(item.publicId, {
      // Must specify resource_type for videos
      // For images the default 'image' works fine
      resource_type: item.mediaType === 'video' ? 'video' : 'image',
    });
  }

  // Then delete from MongoDB
  await item.deleteOne();

  res.json({ message: 'Deleted successfully' });
};

module.exports = { getGallery, getFeatured, uploadMedia, updateMedia, deleteMedia };