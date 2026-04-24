const Post = require('../models/Post');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer  = require('multer');

// Multer storage for blog cover images
// We define this here instead of cloudinary.js to keep blog uploads separate
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'trek-with-ashim/blog',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// Export this so the route can use it
const uploadBlogImage = multer({ storage: blogStorage });

// ─────────────────────────────────────────────
// GET ALL POSTS — GET /api/posts
// Public — only published posts
// Optional filter by category
// ─────────────────────────────────────────────
const getPosts = async (req, res) => {
  const { category, page = 1, limit = 6 } = req.query;

  const query = { isPublished: true };
  if (category) query.category = category;

  const total = await Post.countDocuments(query);

  const posts = await Post.find(query)
    // Don't send full content in list view — too much data
    // Frontend only needs title, excerpt, coverImage etc for the cards
    .select('-content')
    .populate('relatedTrek', 'title slug')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    posts,
    total,
    page:  Number(page),
    pages: Math.ceil(total / limit),
  });
};

// ─────────────────────────────────────────────
// GET ONE POST — GET /api/posts/:slug
// Public — full post content by slug
// ─────────────────────────────────────────────
const getPostBySlug = async (req, res) => {
  const post = await Post.findOne({
    slug:        req.params.slug,
    isPublished: true,
  }).populate('relatedTrek', 'title slug coverImage');

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
};

// ─────────────────────────────────────────────
// GET ALL POSTS (ADMIN) — GET /api/posts/admin/all
// Private — includes drafts
// ─────────────────────────────────────────────
const getAllPostsAdmin = async (req, res) => {
  const posts = await Post.find()
    .select('-content')
    .sort({ createdAt: -1 });
  res.json(posts);
};

// ─────────────────────────────────────────────
// CREATE POST — POST /api/posts
// Private — admin only
// ─────────────────────────────────────────────
const createPost = async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.coverImage = {
      url:      req.file.path,
      publicId: req.file.filename,
    };
  }

  // Parse tags from comma-separated string
  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map(t => t.trim());
  }

  const post = await Post.create(data);
  res.status(201).json(post);
};

// ─────────────────────────────────────────────
// UPDATE POST — PUT /api/posts/:id
// Private — admin only
// ─────────────────────────────────────────────
const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const data = { ...req.body };

  // Replace cover image if a new one was uploaded
  if (req.file) {
    if (post.coverImage?.publicId) {
      await cloudinary.uploader.destroy(post.coverImage.publicId);
    }
    data.coverImage = {
      url:      req.file.path,
      publicId: req.file.filename,
    };
  }

  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map(t => t.trim());
  }

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true, runValidators: true }
  );

  res.json(updated);
};

// ─────────────────────────────────────────────
// DELETE POST — DELETE /api/posts/:id
// Private — admin only
// ─────────────────────────────────────────────
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.coverImage?.publicId) {
    await cloudinary.uploader.destroy(post.coverImage.publicId);
  }

  await post.deleteOne();
  res.json({ message: 'Post deleted successfully' });
};

module.exports = {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadBlogImage, // export multer handler for use in routes
};