const Trek = require('../models/Trek');
const { cloudinary } = require('../config/cloudinary');

const getTreks = async (req, res) => {
  try {
    const { region, difficulty, featured, page = 1, limit = 9 } = req.query;
    const query = { isPublished: true };
    if (region)              query.region     = region;
    if (difficulty)          query.difficulty = difficulty;
    if (featured === 'true') query.isFeatured = true;

    const total = await Trek.countDocuments(query);
    const treks = await Trek.find(query)
      .select('-itinerary -includes -excludes')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ treks, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTreksAdmin = async (req, res) => {
  try {
    const treks = await Trek.find().sort({ createdAt: -1 });
    res.json(treks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrekBySlug = async (req, res) => {
  try {
    const trek = await Trek.findOne({ slug: req.params.slug, isPublished: true });
    if (!trek) return res.status(404).json({ message: 'Trek not found' });
    res.json(trek);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTrek = async (req, res) => {
  try {
    const data = { ...req.body };

    // req.file is populated by multer ONLY when the file is correctly sent
    // If this logs undefined, the frontend is not sending the file correctly
    console.log('createTrek - req.file:', req.file ? req.file.path : 'NO FILE');

    if (req.file) {
      data.coverImage = {
        url:      req.file.path,      // Cloudinary secure URL
        publicId: req.file.filename,  // Cloudinary public_id for deletion
        position: data.coverPosition || 'center center',
      };
    }

    if (!req.file && data.coverPosition) {
      data.coverImage = data.coverImage || {};
      data.coverImage.position = data.coverPosition;
    }

    // Parse JSON strings back to arrays/objects
    ['itinerary', 'highlights', 'includes', 'excludes', 'bestSeason', 'groupSize'].forEach(field => {
      if (typeof data[field] === 'string') {
        try { data[field] = JSON.parse(data[field]); } catch {}
      }
    });

    // FormData sends booleans as strings — convert them
    if (data.isPublished === 'true')  data.isPublished = true;
    if (data.isPublished === 'false') data.isPublished = false;
    if (data.isFeatured  === 'true')  data.isFeatured  = true;
    if (data.isFeatured  === 'false') data.isFeatured  = false;

    const trek = await Trek.create(data);
    res.status(201).json(trek);
  } catch (error) {
    console.error('createTrek error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    const data = { ...req.body };

    if (req.file) {
      if (trek.coverImage?.publicId) {
        await cloudinary.uploader.destroy(trek.coverImage.publicId).catch(() => {});
      }
      data.coverImage = { url: req.file.path, publicId: req.file.filename };
    }

    if (data.coverPosition) {
      data.coverImage = data.coverImage || trek.coverImage || {};
      data.coverImage.position = data.coverPosition;
    }

    ['itinerary', 'highlights', 'includes', 'excludes', 'bestSeason', 'groupSize'].forEach(field => {
      if (typeof data[field] === 'string') {
        try { data[field] = JSON.parse(data[field]); } catch {}
      }
    });

    if (data.isPublished === 'true')  data.isPublished = true;
    if (data.isPublished === 'false') data.isPublished = false;
    if (data.isFeatured  === 'true')  data.isFeatured  = true;
    if (data.isFeatured  === 'false') data.isFeatured  = false;

    const updated = await Trek.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTrekImages = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });
    if (!req.files?.length) return res.status(400).json({ message: 'No images uploaded' });

    const newImages = req.files.map(file => ({
      url: file.path, publicId: file.filename, caption: '',
    }));

    trek.images.push(...newImages);
    await trek.save();
    res.json({ message: newImages.length + ' image(s) added', images: trek.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrekImage = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    const image = trek.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (image.publicId) await cloudinary.uploader.destroy(image.publicId).catch(() => {});
    trek.images.pull(req.params.imageId);
    await trek.save();
    res.json({ message: 'Image deleted', images: trek.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    const ids = [];
    if (trek.coverImage?.publicId) ids.push(trek.coverImage.publicId);
    trek.images.forEach(img => { if (img.publicId) ids.push(img.publicId); });
    await Promise.all(ids.map(id => cloudinary.uploader.destroy(id).catch(() => {})));

    await trek.deleteOne();
    res.json({ message: 'Trek deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTreks, getAllTreksAdmin, getTrekBySlug,
  createTrek, updateTrek, addTrekImages, deleteTrekImage, deleteTrek,
};