const SiteSettings = require('../models/SiteSettings');
const About        = require('../models/About');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary storage for settings images
const settingsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'trek-with-ashim/settings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1800, crop: 'limit', quality: 'auto' }],
  },
});
const uploadSettingsImage = multer({ storage: settingsStorage });

// ─────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────

// GET /api/settings — public, used by frontend to load dynamic content
const getSettings = async (req, res) => {
  // findOneAndUpdate with upsert:true creates the document if it doesn't exist
  // This means we never have to manually seed the database
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) settings = await SiteSettings.create({ key: 'main' });
  res.json(settings);
};

// PUT /api/settings — admin only, update settings
const updateSettings = async (req, res) => {
  const data = { ...req.body };

  // Handle hero image upload
  if (req.files?.heroImage?.[0]) {
    const old = await SiteSettings.findOne({ key: 'main' });
    if (old?.heroImagePublicId) {
      await cloudinary.uploader.destroy(old.heroImagePublicId);
    }
    data.heroImageUrl      = req.files.heroImage[0].path;
    data.heroImagePublicId = req.files.heroImage[0].filename;
  }

  // Handle CTA image upload
  if (req.files?.ctaImage?.[0]) {
    const old = await SiteSettings.findOne({ key: 'main' });
    if (old?.ctaImagePublicId) {
      await cloudinary.uploader.destroy(old.ctaImagePublicId);
    }
    data.ctaImageUrl      = req.files.ctaImage[0].path;
    data.ctaImagePublicId = req.files.ctaImage[0].filename;
  }

  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    data,
    { new: true, upsert: true }
  );
  res.json(settings);
};

// ─────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────

// GET /api/about — public
const getAbout = async (req, res) => {
  let about = await About.findOne({ key: 'main' });
  if (!about) about = await About.create({ key: 'main' });
  res.json(about);
};

// PUT /api/about — admin only
const updateAbout = async (req, res) => {
  const data = { ...req.body };

  // Handle profile image upload
  if (req.file) {
    const old = await About.findOne({ key: 'main' });
    if (old?.profileImagePublicId) {
      await cloudinary.uploader.destroy(old.profileImagePublicId);
    }
    data.profileImageUrl      = req.file.path;
    data.profileImagePublicId = req.file.filename;
  }

  // Parse JSON arrays sent as strings
  ['bioParagraphs', 'certifications', 'timeline', 'values'].forEach(field => {
    if (typeof data[field] === 'string') {
      try { data[field] = JSON.parse(data[field]); } catch {}
    }
  });

  const about = await About.findOneAndUpdate(
    { key: 'main' },
    data,
    { new: true, upsert: true }
  );
  res.json(about);
};

module.exports = {
  getSettings, updateSettings,
  getAbout, updateAbout,
  uploadSettingsImage,
};