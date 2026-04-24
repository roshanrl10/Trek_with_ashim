const express = require('express');
const router  = express.Router();

const {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadBlogImage,
} = require('../controllers/postController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', getPosts);
router.get('/admin/all', protect, adminOnly, getAllPostsAdmin);
router.get('/:slug', getPostBySlug);

// PROTECTED
router.post('/',    protect, adminOnly, uploadBlogImage.single('coverImage'), createPost);
router.put('/:id',  protect, adminOnly, uploadBlogImage.single('coverImage'), updatePost);
router.delete('/:id', protect, adminOnly, deletePost);

module.exports = router;