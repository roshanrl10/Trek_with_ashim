import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import * as posts from '../../api/posts'
import Spinner from '../../components/common/Spinner'
import api from '../../api/axios'

// We need the admin version — let's add it to the posts API
const getAllPostsAdmin = async () => {
  const { data } = await api.get('/posts/admin/all')
  return data
}

const deletePostById = async (id) => {
  const { data } = await api.delete('/posts/' + id)
  return data
}

const AdminPosts = () => {
  const queryClient = useQueryClient()

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn:  getAllPostsAdmin,
  })

  const deleteMutation = useMutation({
    mutationFn: deletePostById,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts'])
      toast.success('Post deleted')
    },
    onError: () => toast.error('Failed to delete'),
  })

  const handleDelete = (id, title) => {
    if (window.confirm('Delete "' + title + '"?')) deleteMutation.mutate(id)
  }

  const publishedStyle = { backgroundColor: '#dcfce7', color: '#166534' }
  const draftStyle     = { backgroundColor: '#fef9c3', color: '#854d0e' }

  if (isLoading) return <Spinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Blog Posts
          </h1>
          <p className="text-gray-500 text-sm mt-1">{posts?.length || 0} posts total</p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Write New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {!posts?.length ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">✍️</p>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500 text-sm mb-6">Share your first trek story</p>
            <Link to="/admin/posts/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Write First Post
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                {['Post', 'Category', 'Read Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                        {post.coverImage?.url ? (
                          <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover" />
                        ) : '📝'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{post.title}</p>
                        <p className="text-xs text-gray-400">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.readTime ? post.readTime + ' min' : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge text-xs font-medium"
                      style={post.isPublished ? publishedStyle : draftStyle}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {post.isPublished && (
                        <a href={'/blog/' + post.slug} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Eye size={15} />
                        </a>
                      )}
                      <Link to={'/admin/posts/edit/' + post._id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => handleDelete(post._id, post.title)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminPosts