const Trek = require('../models/Trek');
const { cloudinary } = require('../config/cloudinary');

// ─────────────────────────────────────────────
// GET ALL TREKS — GET /api/treks
// Public — anyone can view treks
// Supports filtering by region, difficulty, featured
// Supports pagination (page 1, page 2, etc.)
// ─────────────────────────────────────────────
const getTreks = async (req, res) => {
  // req.query contains URL parameters like /api/treks?region=Everest&difficulty=Moderate
  const { region, difficulty, featured, page = 1, limit = 9 } = req.query;

  // Start with base query — only show published treks to the public
  const query = { isPublished: true };

  // Add filters only if they were provided in the URL
  if (region)            query.region     = region;
  if (difficulty)        query.difficulty = difficulty;
  if (featured === 'true') query.isFeatured = true;

  // Count total matching treks (needed for pagination on the frontend)
  const total = await Trek.countDocuments(query);

  // Fetch the treks with pagination
  const treks = await Trek.find(query)
    // Don't send itinerary/includes/excludes in the list view — saves bandwidth
    // The full details are loaded when a user clicks on a specific trek
    .select('-itinerary -includes -excludes')
    .sort({ completedDate: -1 }) // newest completed trek first
    .skip((page - 1) * limit)   // skip past previous pages
    .limit(Number(limit));       // only return this many results

  res.json({
    treks,
    total,
    page:  Number(page),
    pages: Math.ceil(total / limit), // total number of pages
  });
};

// ─────────────────────────────────────────────
// GET ONE TREK — GET /api/treks/:slug
// Public — loads full trek details by slug
// e.g. GET /api/treks/everest-base-camp-trek
// ─────────────────────────────────────────────
const getTrekBySlug = async (req, res) => {
  // req.params.slug is whatever comes after /api/treks/
  const trek = await Trek.findOne({
    slug:        req.params.slug,
    isPublished: true, // don't show drafts to the public
  });

  if (!trek) {
    return res.status(404).json({ message: 'Trek not found' });
  }

  res.json(trek);
};

// ─────────────────────────────────────────────
// GET ALL TREKS (ADMIN) — GET /api/treks/admin/all
// Private — admin only, includes unpublished drafts
// ─────────────────────────────────────────────
const getAllTreksAdmin = async (req, res) => {
  // No isPublished filter — admin sees everything
  const treks = await Trek.find().sort({ createdAt: -1 });
  res.json(treks);
};

// ─────────────────────────────────────────────
// CREATE TREK — POST /api/treks
// Private — admin only
// ─────────────────────────────────────────────
const createTrek = async (req, res) => {
  // req.body contains all the text fields (title, description, etc.)
  // req.file contains the uploaded cover image (processed by multer + cloudinary)
  const data = { ...req.body };

  // If a cover image was uploaded, multer puts it in req.file
  // req.file.path is the Cloudinary URL
  // req.file.filename is the Cloudinary public_id (needed to delete later)
  if (req.file) {
    data.coverImage = {
      url:      req.file.path,
      publicId: req.file.filename,
    };
  }

  // When data is sent as FormData (which is needed for file uploads),
  // arrays and objects come through as JSON strings — we need to parse them back
  const jsonFields = ['itinerary', 'highlights', 'includes', 'excludes', 'bestSeason', 'groupSize'];
  jsonFields.forEach(field => {
    if (typeof data[field] === 'string') {
      try {
        data[field] = JSON.parse(data[field]);
      } catch {
        // if it fails, leave it as is
      }
    }
  });

  const trek = await Trek.create(data);
  res.status(201).json(trek);
};

// ─────────────────────────────────────────────
// UPDATE TREK — PUT /api/treks/:id
// Private — admin only
// ─────────────────────────────────────────────
const updateTrek = async (req, res) => {
  // Find the trek by its MongoDB ID
  const trek = await Trek.findById(req.params.id);

  if (!trek) {
    return res.status(404).json({ message: 'Trek not found' });
  }

  const data = { ...req.body };

  // If a new cover image was uploaded, delete the old one from Cloudinary first
  if (req.file) {
    if (trek.coverImage?.publicId) {
      // Delete the old image from Cloudinary to avoid wasting storage
      await cloudinary.uploader.destroy(trek.coverImage.publicId);
    }
    data.coverImage = {
      url:      req.file.path,
      publicId: req.file.filename,
    };
  }

  // Parse JSON string fields again (same reason as createTrek)
  const jsonFields = ['itinerary', 'highlights', 'includes', 'excludes', 'bestSeason', 'groupSize'];
  jsonFields.forEach(field => {
    if (typeof data[field] === 'string') {
      try { data[field] = JSON.parse(data[field]); } catch {}
    }
  });

  // findByIdAndUpdate returns the NEW updated document (new: true)
  // runValidators: true means the schema rules are checked during update too
  const updatedTrek = await Trek.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true, runValidators: true }
  );

  res.json(updatedTrek);
};

// ─────────────────────────────────────────────
// ADD IMAGES TO TREK — POST /api/treks/:id/images
// Private — admin only
// Ashim can add more photos to an existing trek
// ─────────────────────────────────────────────
const addTrekImages = async (req, res) => {
  const trek = await Trek.findById(req.params.id);

  if (!trek) {
    return res.status(404).json({ message: 'Trek not found' });
  }

  // req.files is an array when using .array() in the route
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url:      file.path,
      publicId: file.filename,
      caption:  '', // empty caption by default — Ashim can edit later
    }));

    // Push new images into the existing images array
    trek.images.push(...newImages);
    await trek.save();
  }

  res.json(trek.images);
};

// ─────────────────────────────────────────────
// DELETE TREK — DELETE /api/treks/:id
// Private — admin only
// Deletes the trek AND all its images from Cloudinary
// ─────────────────────────────────────────────
const deleteTrek = async (req, res) => {
  const trek = await Trek.findById(req.params.id);

  if (!trek) {
    return res.status(404).json({ message: 'Trek not found' });
  }

  // Gather all Cloudinary public IDs (cover image + all extra images)
  const imagesToDelete = [trek.coverImage, ...trek.images]
    .filter(img => img?.publicId); // filter out any that don't have a publicId

  // Delete all images from Cloudinary simultaneously
  // Promise.all runs all deletions at the same time instead of one by one
  await Promise.all(
    imagesToDelete.map(img => cloudinary.uploader.destroy(img.publicId))
  );

  // Delete the trek document from MongoDB
  await trek.deleteOne();

  res.json({ message: 'Trek deleted successfully' });
};

module.exports = {
  getTreks,
  getTrekBySlug,
  getAllTreksAdmin,
  createTrek,
  updateTrek,
  addTrekImages,
  deleteTrek,
};