// cloudinary is the main SDK for talking to the Cloudinary service
const cloudinary = require('cloudinary').v2;

// CloudinaryStorage is a multer storage engine
// Instead of saving files to your hard drive, it sends them straight to Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// multer handles file uploads — it reads the file from the request
const multer = require('multer');

// Configure cloudinary with your account credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─────────────────────────────────────────────
// STORAGE for Trek cover images and photos
// ─────────────────────────────────────────────
const trekStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    // Cloudinary folder — all trek photos go here
    folder: 'trek-with-ashim/treks',

    // Only allow these file types
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],

    // Automatically resize to max 1200px wide and compress quality
    // This saves storage and makes the website load faster
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// ─────────────────────────────────────────────
// STORAGE for Gallery (photos AND videos)
// ─────────────────────────────────────────────
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'trek-with-ashim/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'],

    // 'auto' detects whether it's an image or video automatically
    resource_type: 'auto',
    transformation: [{ quality: 'auto' }],
  },
});

// Create multer upload handlers using the storage configs above
// uploadTrekPhoto.single('coverImage') — handles one file with field name 'coverImage'
// uploadTrekPhoto.array('images', 20) — handles up to 20 files with field name 'images'
const uploadTrekPhoto = multer({ storage: trekStorage });
const uploadGallery   = multer({ storage: galleryStorage });

// Export cloudinary itself (needed for deleting images)
// Export the upload handlers (needed in routes)
module.exports = { cloudinary, uploadTrekPhoto, uploadGallery };