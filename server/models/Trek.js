const mongoose = require('mongoose');
const slugify = require('slugify');

// A sub-schema for itinerary days
// This is a schema inside a schema — each trek has an array of these
const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true }, // e.g. "Kathmandu to Lukla"
  description: String,
  altitude: String, // e.g. "2,860m"
  distance: String, // e.g. "35 min flight"
});

const trekSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // e.g. "Everest Base Camp Trek"
    },

    // A URL-friendly version of the title
    // "Everest Base Camp Trek" becomes "everest-base-camp-trek"
    // This is used in URLs: /treks/everest-base-camp-trek
    slug: {
      type: String,
      unique: true,
    },

    tagline: String, // Short catchy line: "Walk in the footsteps of legends"

    description: {
      type: String,
      required: true, // Full description of the trek
    },

    region: {
      type: String,
      // enum means only these exact values are accepted — prevents typos
      enum: ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Kanchenjunga', 'Dolpo', 'Other'],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Strenuous', 'Extreme'],
      required: true,
    },

    duration: {
      type: Number, // number of days
      required: true,
    },

    maxAltitude: String, // e.g. "5,364m"
    startPoint: String,  // e.g. "Lukla"
    endPoint: String,    // e.g. "Lukla"

    // Array of strings — e.g. ["March", "April", "October", "November"]
    bestSeason: [String],

    // Cover image — stored as an object with url and publicId
    // publicId is the Cloudinary ID we need if we want to delete the image later
    coverImage: {
      url: String,
      publicId: String,
    },

    // Array of additional photos for the trek detail page
    images: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],

    // Array of itinerary days using the sub-schema we defined above
    itinerary: [itinerarySchema],

    // Simple arrays of strings
    highlights: [String], // ["Views of 8 of world's 14 highest peaks", ...]
    includes:   [String], // ["All meals on trek", "Experienced guide", ...]
    excludes:   [String], // ["International flights", "Travel insurance", ...]

    price: Number, // price in USD

    groupSize: {
      min: Number, // minimum group size
      max: Number, // maximum group size
    },

    // Draft vs published — Ashim can save a draft and publish later
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Featured treks appear on the homepage
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // When Ashim actually did this trek — useful for "recently completed" section
    completedDate: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// MIDDLEWARE — runs before saving a trek
// Automatically generates the slug from the title
trekSchema.pre('save', function (next) {
  // Only regenerate slug if the title was changed
  if (this.isModified('title')) {
    // slugify converts "Everest Base Camp Trek!" to "everest-base-camp-trek"
    // lower: true = lowercase everything
    // strict: true = remove special characters
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Trek', trekSchema);