import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import toast from 'react-hot-toast'
import { ArrowLeft, Plus, X, Upload } from 'lucide-react'
import { createTrek } from '../../api/treks'
import Spinner from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'

const REGIONS     = ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Kanchenjunga', 'Dolpo', 'Other']
const DIFFICULTIES = ['Easy', 'Moderate', 'Strenuous', 'Extreme']
const SEASONS      = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const AdminAddTrek = () => {
  const navigate = useNavigate()
  const [isLoading,    setIsLoading]    = useState(false)
  const [coverPreview, setCoverPreview] = useState(null)
  const [highlights,   setHighlights]   = useState([''])
  const [includes,     setIncludes]     = useState([''])
  const [excludes,     setExcludes]     = useState([''])
  const [bestSeason,   setBestSeason]   = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm()

  // Handle cover image preview before upload
  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // FileReader reads the file locally so we can show a preview
      // before actually uploading to Cloudinary
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  // Helpers for dynamic list fields (highlights, includes, excludes)
  const addItem    = (setter)        => setter(prev => [...prev, ''])
  const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index))
  const updateItem = (setter, index, value) =>
    setter(prev => prev.map((item, i) => i === index ? value : item))

  const toggleSeason = (season) => {
    setBestSeason(prev =>
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    )
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // We must use FormData because we're sending a file (cover image)
      // JSON can't carry binary file data — FormData can
      const formData = new FormData()

      // Add all text fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key])
        }
      })

      // Add the cover image file
      if (data.coverImage?.[0]) {
        formData.append('coverImage', data.coverImage[0])
      }

      // Add arrays as JSON strings
      // Backend will parse these back into arrays
      const cleanHighlights = highlights.filter(h => h.trim())
      const cleanIncludes   = includes.filter(i => i.trim())
      const cleanExcludes   = excludes.filter(e => e.trim())

      if (cleanHighlights.length) formData.append('highlights', JSON.stringify(cleanHighlights))
      if (cleanIncludes.length)   formData.append('includes',   JSON.stringify(cleanIncludes))
      if (cleanExcludes.length)   formData.append('excludes',   JSON.stringify(cleanExcludes))
      if (bestSeason.length)      formData.append('bestSeason', JSON.stringify(bestSeason))

      await createTrek(formData)
      toast.success('Trek created successfully! 🏔️')
      navigate('/admin/treks')

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create trek')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/treks"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Add New Trek
          </h1>
          <p className="text-gray-500 text-sm">Fill in the details of your trek</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── BASIC INFO ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trek Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Everest Base Camp Trek"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: errors.title ? '#ef4444' : '#e5e7eb' }}
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Tagline */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. Walk in the footsteps of legends"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#e5e7eb' }}
                {...register('tagline')}
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region *
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white"
                style={{ borderColor: errors.region ? '#ef4444' : '#e5e7eb' }}
                {...register('region', { required: 'Region is required' })}
              >
                <option value="">Select region</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && (
                <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white"
                style={{ borderColor: errors.difficulty ? '#ef4444' : '#e5e7eb' }}
                {...register('difficulty', { required: 'Difficulty is required' })}
              >
                <option value="">Select difficulty</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days) *
              </label>
              <input
                type="number"
                placeholder="14"
                min="1"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: errors.duration ? '#ef4444' : '#e5e7eb' }}
                {...register('duration', { required: 'Duration is required', min: 1 })}
              />
            </div>

            {/* Max Altitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Altitude
              </label>
              <input
                type="text"
                placeholder="e.g. 5,364m"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#e5e7eb' }}
                {...register('maxAltitude')}
              />
            </div>

            {/* Start Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Point
              </label>
              <input
                type="text"
                placeholder="e.g. Lukla"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#e5e7eb' }}
                {...register('startPoint')}
              />
            </div>

            {/* End Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Point
              </label>
              <input
                type="text"
                placeholder="e.g. Lukla"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#e5e7eb' }}
                {...register('endPoint')}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD)
              </label>
              <input
                type="number"
                placeholder="1200"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#e5e7eb' }}
                {...register('price')}
              />
            </div>

          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={5}
              placeholder="Write a full description of the trek..."
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
              style={{ borderColor: errors.description ? '#ef4444' : '#e5e7eb' }}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

        </div>

        {/* ── COVER IMAGE ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Cover Image</h2>

          {coverPreview ? (
            // Show preview of selected image
            <div className="relative rounded-xl overflow-hidden h-64">
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverPreview(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            // Upload area
            <label
              className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
              style={{ borderColor: '#d1d5db', backgroundColor: '#f9fafb' }}
            >
              <Upload size={32} className="text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600">Click to upload cover image</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('coverImage')}
                onChange={handleCoverChange}
              />
            </label>
          )}
        </div>

        {/* ── BEST SEASON ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Best Season</h2>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map(season => (
              <button
                key={season}
                type="button"
                onClick={() => toggleSeason(season)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                style={
                  bestSeason.includes(season)
                    ? { backgroundColor: 'var(--color-forest-700)', color: 'white', borderColor: 'var(--color-forest-700)' }
                    : { backgroundColor: 'white', color: '#374151', borderColor: '#d1d5db' }
                }
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* ── HIGHLIGHTS ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Highlights</h2>
            <button
              type="button"
              onClick={() => addItem(setHighlights)}
              className="flex items-center gap-1 text-sm font-medium"
              style={{ color: 'var(--color-forest-700)' }}
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {highlights.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={e => updateItem(setHighlights, i, e.target.value)}
                  placeholder={`Highlight ${i + 1}`}
                  className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#e5e7eb' }}
                />
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(setHighlights, i)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── INCLUDES & EXCLUDES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Includes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Included</h2>
              <button type="button" onClick={() => addItem(setIncludes)}
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color: 'var(--color-forest-700)' }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => updateItem(setIncludes, i, e.target.value)}
                    placeholder="e.g. All meals on trek"
                    className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  {includes.length > 1 && (
                    <button type="button" onClick={() => removeItem(setIncludes, i)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Excludes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Not Included</h2>
              <button type="button" onClick={() => addItem(setExcludes)}
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color: 'var(--color-forest-700)' }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-3">
              {excludes.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => updateItem(setExcludes, i, e.target.value)}
                    placeholder="e.g. International flights"
                    className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  {excludes.length > 1 && (
                    <button type="button" onClick={() => removeItem(setExcludes, i)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── PUBLISH OPTIONS ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Publishing</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded"
                {...register('isPublished')}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Publish immediately</p>
                <p className="text-xs text-gray-500">Make this trek visible to visitors</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded"
                {...register('isFeatured')}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Feature on homepage</p>
                <p className="text-xs text-gray-500">Show in the featured treks section</p>
              </div>
            </label>
          </div>
        </div>

        {/* ── SUBMIT BUTTONS ── */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <Link to="/admin/treks" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="small" />
                Saving...
              </>
            ) : (
              'Create Trek'
            )}
          </button>
        </div>

      </form>
    </div>
  )
}

export default AdminAddTrek