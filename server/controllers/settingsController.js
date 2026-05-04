const SiteSettings = require('../models/SiteSettings');
const About = require('../models/About');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const settingsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'trek-with-ashim/settings',
    resource_type: 'auto',       // auto-detect image type
    transformation: [{ width: 1920, crop: 'limit', quality: 'auto' }],
  },
})

const uploadSettingsImage = multer({ storage: settingsStorage });

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'main' });
    if (!settings) settings = await SiteSettings.create({ key: 'main' });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const data = { ...req.body };
    const old = await SiteSettings.findOne({ key: 'main' });

    if (req.files?.heroImage?.[0]) {
      if (old?.heroImagePublicId) await cloudinary.uploader.destroy(old.heroImagePublicId);
      data.heroImageUrl = req.files.heroImage[0].path;
      data.heroImagePublicId = req.files.heroImage[0].filename;
    }

    if (req.files?.ctaImage?.[0]) {
      if (old?.ctaImagePublicId) await cloudinary.uploader.destroy(old.ctaImagePublicId);
      data.ctaImageUrl = req.files.ctaImage[0].path;
      data.ctaImagePublicId = req.files.ctaImage[0].filename;
    }

    if (data.heroImagePosition === undefined) {
      data.heroImagePosition = old?.heroImagePosition || 'center center';
    }
    if (data.ctaImagePosition === undefined) {
      data.ctaImagePosition = old?.ctaImagePosition || 'center center';
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      data,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAbout = async (req, res) => {
  try {
    let about = await About.findOne({ key: 'main' });
    if (!about) about = await About.create({ key: 'main' });
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const old = await About.findOne({ key: 'main' });
      if (old?.profileImagePublicId) await cloudinary.uploader.destroy(old.profileImagePublicId);
      data.profileImageUrl = req.file.path;
      data.profileImagePublicId = req.file.filename;
    }

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings, getAbout, updateAbout, uploadSettingsImage };