import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Upload, Trash2, Star, X, Image } from 'lucide-react'
import * as gallery from '../../api/gallery'
import { getTreks } from '../../api/treks'
import Spinner from '../../components/common/Spinner'
import api from '../../api/axios'

const AdminGallery = () => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)

  const [uploading,   setUploading]   = useState(false)
  const [dragOver,    setDragOver]    = useState(false)
  const [uploadForm,  setUploadForm]  = useState({ trek: '', location: '', caption: '', tags: '' })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const { data: galleryData, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn:  () => gallery.getGallery({ limit: 50 }),
  })

  const { data: treksData } = useQuery({
    queryKey: ['treks-simple'],
    queryFn:  () => getTreks({ limit: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: gallery.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gallery'])
      toast.success('Deleted')
    },
  })

  const featureMutation = useMutation({
    mutationFn: ({ id, isFeatured }) => gallery.updateMedia(id, { isFeatured }),
    onSuccess: () => queryClient.invalidateQueries(['admin-gallery']),
  })

  // Handle file selection (from input or drag-drop)
  const handleFiles = (files) => {
    const arr = Array.from(files)
    setSelectedFiles(arr)
    const newPreviews = arr.map(f => ({
      name: f.name,
      url:  URL.createObjectURL(f),
      type: f.type.startsWith('video') ? 'video' : 'photo',
    }))
    setPreviews(newPreviews)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast.error('Please select files first')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      selectedFiles.forEach(f => formData.append('media', f))
      if (uploadForm.trek)     formData.append('trek',     uploadForm.trek)
      if (uploadForm.location) formData.append('location', uploadForm.location)
      if (uploadForm.caption)  formData.append('caption',  uploadForm.caption)
      if (uploadForm.tags)     formData.append('tags',     uploadForm.tags)

      await gallery.uploadMedia(formData)
      toast.success(selectedFiles.length + ' file(s) uploaded!')
      setSelectedFiles([])
      setPreviews([])
      setUploadForm({ trek: '', location: '', caption: '', tags: '' })
      queryClient.invalidateQueries(['admin-gallery'])
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this media?')) deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
          Gallery
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {galleryData?.total || 0} items in gallery
        </p>
      </div>

      {/* ── UPLOAD SECTION ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-bold text-gray-900 mb-5">Upload New Media</h2>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-5"
          style={{ borderColor: dragOver ? 'var(--color-forest-600)' : '#d1d5db',
                   backgroundColor: dragOver ? '#f0fdf4' : '#fafafa' }}
        >
          <Upload size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="font-medium text-gray-700">Drag and drop photos/videos here</p>
          <p className="text-sm text-gray-400 mt-1">or click to browse — JPG, PNG, MP4, MOV</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {/* Selected file previews */}
        {previews.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {previews.length} file(s) selected
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {previews.map((prev, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {prev.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                  ) : (
                    <img src={prev.url} alt={prev.name} className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))
                      setPreviews(prev => prev.filter((_, idx) => idx !== i))
                    }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload metadata form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Link to Trek</label>
            <select
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
              style={{ borderColor: '#e5e7eb' }}
              value={uploadForm.trek}
              onChange={e => setUploadForm(p => ({ ...p, trek: e.target.value }))}
            >
              <option value="">No specific trek</option>
              {treksData?.treks?.map(t => (
                <option key={t._id} value={t._id}>{t.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Kala Patthar"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
              value={uploadForm.location}
              onChange={e => setUploadForm(p => ({ ...p, location: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
            <input
              type="text"
              placeholder="Short caption..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
              value={uploadForm.caption}
              onChange={e => setUploadForm(p => ({ ...p, caption: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="sunrise, everest"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
              value={uploadForm.tags}
              onChange={e => setUploadForm(p => ({ ...p, tags: e.target.value }))}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || !selectedFiles.length}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading {selectedFiles.length} file(s)...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload {selectedFiles.length > 0 ? selectedFiles.length + ' file(s)' : 'Files'}
            </>
          )}
        </button>
      </div>

      {/* ── GALLERY GRID ── */}
      {isLoading ? (
        <Spinner />
      ) : !galleryData?.items?.length ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <Image size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No photos yet</h3>
          <p className="text-gray-400 text-sm">Upload your first photos above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {galleryData.items.map(item => (
            <div key={item._id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">

              {/* Media */}
              {item.mediaType === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-4xl">🎬</div>
              ) : (
                <img src={item.url} alt={item.caption || ''} className="w-full h-full object-cover" />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">

                {/* Feature toggle */}
                <button
                  onClick={() => featureMutation.mutate({ id: item._id, isFeatured: !item.isFeatured })}
                  title={item.isFeatured ? 'Unfeature' : 'Feature'}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: item.isFeatured ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}
                >
                  <Star size={15} className="text-white" fill={item.isFeatured ? 'white' : 'none'} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="w-9 h-9 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                >
                  <Trash2 size={15} className="text-white" />
                </button>
              </div>

              {/* Featured badge */}
              {item.isFeatured && (
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                  <Star size={12} className="text-white" fill="white" />
                </div>
              )}

              {/* Caption */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs truncate">{item.caption}</p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminGallery