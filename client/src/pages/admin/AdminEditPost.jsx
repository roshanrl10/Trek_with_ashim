import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload, X, CheckCircle } from 'lucide-react'
import api from '../../api/axios'
import Spinner from '../../components/common/Spinner'

const CATEGORIES = ['Trek Story', 'Tips & Tricks', 'Gear Review', 'Culture', 'News']

const DraggableImageField = ({ label, currentUrl, onFileSelect, preview, position, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const rect = e.target.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))
    onPositionChange(`${clampedX}% ${clampedY}%`)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {(preview || currentUrl) && (
        <div
          className="relative rounded-xl overflow-hidden mb-3 cursor-move"
          style={{ height: '180px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={preview || currentUrl}
            alt={label}
            className="w-full h-full object-cover"
            style={{ objectPosition: position || 'center center' }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <p className="text-white text-sm font-medium">Drag to adjust focus</p>
          </div>
        </div>
      )}

      {preview && (
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-green-700">
          <CheckCircle size={15} />
          Image selected — click Save to upload
        </div>
      )}

      {!preview && !currentUrl && (
        <p className="text-xs text-gray-400 mb-3">No image yet — blog post will show placeholder</p>
      )}

      <label
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-green-500 hover:bg-green-50"
        style={{ borderColor: '#d1d5db' }}
      >
        <Upload size={18} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600">
          {preview || currentUrl ? 'Choose different image' : 'Upload image'}
        </span>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0]
            if (!file) return
            onFileSelect(file)
          }}
        />
      </label>
      <p className="text-xs text-gray-400 mt-2">Any format (JPG, PNG, WebP, HEIC) — recommended 1200x800</p>
    </div>
  )
}

const AdminEditPost = () => {
  const { id }     = useParams()      // undefined for new post, id for edit
  const isEdit     = Boolean(id)
  const navigate   = useNavigate()
  const queryClient = useQueryClient()
  const [coverPrev, setCoverPrev] = useState(null)
  const [coverPosition, setCoverPosition] = useState('center center')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Load existing post data if editing
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post-edit', id],
    queryFn:  () => api.get('/posts/admin/all').then(r => r.data.find(p => p._id === id)),
    enabled:  isEdit,
  })

  useEffect(() => {
    if (post) {
      reset(post)
      setCoverPosition(post.coverImage?.position || 'center center')
    }
  }, [post, reset])

  const savePostMutation = useMutation({
    mutationFn: async (formData) => {
      if (isEdit) {
        const { data } = await api.put('/posts/' + id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return data
      } else {
        const { data } = await api.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['admin-posts'])
      toast.success(isEdit ? 'Post updated!' : 'Post created!')
      navigate('/admin/posts')
    },
    onError: () => {
      toast.error('Failed to save post')
    },
  })

  const onSubmit = (data) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null && key !== 'coverImage') {
        formData.append(key, data[key])
      }
    })

    const coverInput = document.querySelector('input[name="coverImage"]')
    if (coverInput?.files?.[0] instanceof File) {
      formData.append('coverImage', coverInput.files[0])
    }

    formData.append('coverPosition', coverPosition)

    savePostMutation.mutate(formData)
  }

  if (isEdit && postLoading) return <Spinner />

  const inputStyle = { borderColor: '#e5e7eb' }
  const inputClass = 'w-full px-4 py-3 rounded-xl border text-sm outline-none'

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/posts"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-200 text-gray-600">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {isEdit ? 'Edit Post' : 'Write New Post'}
          </h1>
          <p className="text-gray-500 text-sm">{isEdit ? 'Update your story' : 'Share your trek experience'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">Post Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input className={inputClass} style={inputStyle}
              placeholder="e.g. My First Week on the Everest Trail"
              {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea rows={2} className={inputClass + ' resize-none'} style={inputStyle}
              placeholder="Short summary shown on blog listing page..."
              {...register('excerpt')} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className={inputClass + ' bg-white'} style={inputStyle} {...register('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input className={inputClass} style={inputStyle}
                placeholder="everest, sunrise, tips"
                {...register('tags')} />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Cover Image</h2>

          <DraggableImageField
            label="Cover Image"
            currentUrl={post?.coverImage?.url}
            preview={coverPrev}
            position={coverPosition}
            onPositionChange={setCoverPosition}
            onFileSelect={(file) => {
              setCoverPrev(URL.createObjectURL(file))
              // Update the form data
              const dataTransfer = new DataTransfer()
              dataTransfer.items.add(file)
              const input = document.querySelector('input[name="coverImage"]')
              if (input) input.files = dataTransfer.files
            }}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Content *</h2>
          <p className="text-xs text-gray-400 mb-3">
            Write your full post here. Use double line breaks for new paragraphs.
          </p>
          <textarea
            rows={20}
            placeholder="Write your trek story here...&#10;&#10;Day 1: We started from Lukla at 6am...&#10;&#10;The trail wound through..."
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none font-mono"
            style={{ borderColor: errors.content ? '#ef4444' : '#e5e7eb' }}
            {...register('content', { required: 'Content is required' })}
          />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
        </div>

        {/* Publish Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Publishing</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 rounded" {...register('isPublished')} />
            <div>
              <p className="text-sm font-medium text-gray-900">Publish immediately</p>
              <p className="text-xs text-gray-500">Make visible on the public blog</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <Link to="/admin/posts" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={savePostMutation.isPending} className="btn-primary flex items-center gap-2">
            {savePostMutation.isPending ? 'Saving...' : (isEdit ? 'Update Post' : 'Publish Post')}
          </button>
        </div>

      </form>
    </div>
  )
}

export default AdminEditPost