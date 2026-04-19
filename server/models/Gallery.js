const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    caption: String,

    url: {
      type: String,
      required: true, // every gallery item must have a URL (the Cloudinary link)
    },

    publicId: String, // Cloudinary ID for deletion

    // Is this a photo or a video?
    mediaType: {
      type: String,
      enum: ['photo', 'video'],
      default: 'photo',
    },

    // Optional — which trek is this photo from?
    // "ref: 'Trek'" creates a relationship — this ID points to a Trek document
    trek: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trek',
    },

    tags: [String],    // e.g. ["sunrise", "everest", "camp3"]
    location: String,  // e.g. "Kala Patthar, 5,645m"
    takenAt: Date,     // when the photo was taken

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);