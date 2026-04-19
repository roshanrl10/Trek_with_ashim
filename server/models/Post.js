const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    // The full blog content — this will be long text
    content: {
      type: String,
      required: true,
    },

    // A short 1-2 sentence summary shown on the blog listing page
    excerpt: String,

    coverImage: {
      url: String,
      publicId: String,
    },

    category: {
      type: String,
      enum: ['Trek Story', 'Tips & Tricks', 'Gear Review', 'Culture', 'News'],
      default: 'Trek Story',
    },

    tags: [String],

    // Optional link to a related trek
    relatedTrek: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trek',
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    // Estimated reading time in minutes — calculated automatically
    readTime: Number,
  },
  { timestamps: true }
);

// Auto-generate slug and calculate read time before saving
postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Calculate reading time — average person reads ~200 words per minute
  if (this.isModified('content')) {
    const wordCount = this.content.split(' ').length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  next();
});

module.exports = mongoose.model('Post', postSchema);