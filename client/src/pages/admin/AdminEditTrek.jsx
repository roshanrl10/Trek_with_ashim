import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, X, Upload, Trash2, CheckCircle } from 'lucide-react'
import api from '../../api/axios'
import Spinner from '../../components/common/Spinner'

const REGIONS      = ['Everest','Annapurna','Langtang','Manaslu','Mustang','Kanchenjunga','Dolpo','Other']
const DIFFICULTIES = ['Easy','Moderate','Strenuous','Extreme']
const SEASONS      = ['January','February','March','April','May','June','July','August','September','October','November','December']

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
          Image selected — click Save Trek to upload
        </div>
      )}

      {!preview && !currentUrl && (
        <p className="text-xs text-gray-400 mb-3">No image yet — trek card shows placeholder</p>
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

const AdminEditTrek = () => {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const queryClient = useQueryClient()

  const [saving,        setSaving]        = useState(false)
  const [uploadingMore, setUploadingMore] = useState(false)

  // Form state — plain useState, no react-hook-form
  const [title,       setTitle]       = useState('')
  const [tagline,     setTagline]     = useState('')
  const [description, setDescription] = useState('')
  const [region,      setRegion]      = useState('')
  const [difficulty,  setDifficulty]  = useState('')
  const [duration,    setDuration]    = useState('')
  const [maxAltitude, setMaxAltitude] = useState('')
  const [startPoint,  setStartPoint]  = useState('')
  const [endPoint,    setEndPoint]    = useState('')
  const [price,       setPrice]       = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured,  setIsFeatured]  = useState(false)
  const [bestSeason,  setBestSeason]  = useState([])
  const [highlights,  setHighlights]  = useState([''])
  const [includes,    setIncludes]    = useState([''])
  const [excludes,    setExcludes]    = useState([''])

  // Cover image state
  const [coverFile,       setCoverFile]       = useState(null)
  const [coverPreview,    setCoverPreview]    = useState(null)
  const [currentCoverUrl, setCurrentCoverUrl] = useState(null)
  const [coverPosition,   setCoverPosition]   = useState('center center')

  // Extra images list
  const [trekImages, setTrekImages] = useState([])

  // Load trek
  const { data: trek, isLoading } = useQuery({
    queryKey: ['trek-edit', id],
    queryFn:  () => api.get('/treks/admin/all').then(r => {
      const found = r.data.find(t => t._id === id)
      if (!found) throw new Error('Trek not found')
      return found
    }),
  })

  useEffect(() => {
    if (!trek) return
    setTitle(trek.title          || '')
    setTagline(trek.tagline      || '')
    setDescription(trek.description || '')
    setRegion(trek.region        || '')
    setDifficulty(trek.difficulty || '')
    setDuration(String(trek.duration || ''))
    setMaxAltitude(trek.maxAltitude  || '')
    setStartPoint(trek.startPoint   || '')
    setEndPoint(trek.endPoint       || '')
    setPrice(String(trek.price      || ''))
    setIsPublished(trek.isPublished  || false)
    setIsFeatured(trek.isFeatured    || false)
    setBestSeason(trek.bestSeason    || [])
    setHighlights(trek.highlights?.length ? trek.highlights : [''])
    setIncludes(trek.includes?.length   ? trek.includes   : [''])
    setExcludes(trek.excludes?.length   ? trek.excludes   : [''])
    setCurrentCoverUrl(trek.coverImage?.url || null)
    setCoverPosition(trek.coverImage?.position || 'center center')
    setTrekImages(trek.images || [])
  }, [trek])

  // Helpers
  const addItem    = (s) => s(p => [...p, ''])
  const removeItem = (s, i) => s(p => p.filter((_, x) => x !== i))
  const updateItem = (s, i, v) => s(p => p.map((x, idx) => idx === i ? v : x))
  const toggleSeason = (season) => setBestSeason(p =>
    p.includes(season) ? p.filter(s => s !== season) : [...p, season]
  )

  const handleCoverSelect = (file) => {
    setCoverFile(file)
    const r = new FileReader()
    r.onloadend = () => setCoverPreview(r.result)
    r.readAsDataURL(file)
  }

  // Save all trek data including cover image
  const handleSave = async () => {
    if (!title.trim()) return toast.error('Title is required')
    if (!region)       return toast.error('Region is required')
    if (!difficulty)   return toast.error('Difficulty is required')
    if (!duration)     return toast.error('Duration is required')

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title',       title.trim())
      fd.append('tagline',     tagline.trim())
      fd.append('description', description.trim())
      fd.append('region',      region)
      fd.append('difficulty',  difficulty)
      fd.append('duration',    duration)
      fd.append('maxAltitude', maxAltitude.trim())
      fd.append('startPoint',  startPoint.trim())
      fd.append('endPoint',    endPoint.trim())
      fd.append('price',       price)
      fd.append('isPublished', String(isPublished))
      fd.append('isFeatured',  String(isFeatured))
      fd.append('bestSeason',  JSON.stringify(bestSeason))
      fd.append('highlights',  JSON.stringify(highlights.filter(h => h.trim())))
      fd.append('includes',    JSON.stringify(includes.filter(i => i.trim())))
      fd.append('excludes',    JSON.stringify(excludes.filter(e => e.trim())))
      fd.append('coverPosition', coverPosition)

      // Attach the actual File object — this is what multer needs
      if (coverFile) {
        fd.append('coverImage', coverFile)
        console.log('Uploading new cover:', coverFile.name)
      }

      const { data } = await api.put('/treks/' + id, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Update local state with response
      if (data.coverImage?.url) {
        setCurrentCoverUrl(data.coverImage.url)
        setCoverFile(null)
        setCoverPreview(null)
      }

      queryClient.invalidateQueries(['trek-edit', id])
      queryClient.invalidateQueries(['admin-treks'])
      queryClient.invalidateQueries(['treks'])
      toast.success('Trek saved! ✅')
      navigate('/admin/treks')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Upload extra images
  const handleUploadMore = async (files) => {
    if (!files?.length) return
    setUploadingMore(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('images', f))

      const { data } = await api.post('/treks/' + id + '/images', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setTrekImages(data.images || [])
      toast.success(files.length + ' photo(s) added!')
    } catch (err) {
      toast.error('Upload failed')
      console.error(err)
    } finally {
      setUploadingMore(false)
    }
  }

  // Delete one extra image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this photo?')) return
    try {
      await api.delete('/treks/' + id + '/images/' + imageId)
      setTrekImages(p => p.filter(img => img._id !== imageId))
      toast.success('Photo deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  if (isLoading) return <Spinner />

  const ic = 'w-full px-4 py-3 rounded-xl border text-sm outline-none'
  const is = { borderColor: '#e5e7eb' }
  const sa = { backgroundColor: 'var(--color-forest-700)', color: 'white', borderColor: 'var(--color-forest-700)' }
  const si = { backgroundColor: 'white', color: '#374151', borderColor: '#d1d5db' }

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/treks"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-200 text-gray-600">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Edit Trek
          </h1>
          <p className="text-gray-500 text-sm">{trek?.title}</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* BASIC INFO */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trek Title *</label>
            <input className={ic} style={is} value={title} onChange={e => setTitle(e.target.value)} placeholder="Everest Base Camp Trek" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            <input className={ic} style={is} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Walk in the footsteps of legends" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
              <select className={ic + ' bg-white'} style={is} value={region} onChange={e => setRegion(e.target.value)}>
                <option value="">Select</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
              <select className={ic + ' bg-white'} style={is} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="">Select</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days) *</label>
              <input type="number" className={ic} style={is} value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Altitude</label>
              <input className={ic} style={is} value={maxAltitude} onChange={e => setMaxAltitude(e.target.value)} placeholder="5,364m" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Point</label>
              <input className={ic} style={is} value={startPoint} onChange={e => setStartPoint(e.target.value)} placeholder="Lukla" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Point</label>
              <input className={ic} style={is} value={endPoint} onChange={e => setEndPoint(e.target.value)} placeholder="Lukla" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <input type="number" className={ic} style={is} value={price} onChange={e => setPrice(e.target.value)} placeholder="1200" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea rows={5} className={ic + ' resize-none'} style={is} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        {/* COVER IMAGE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Cover Image</h2>
            <p className="text-sm text-gray-500 mt-1">Shown on trek cards and at the top of the detail page</p>
          </div>

          <DraggableImageField
            label="Cover Image"
            currentUrl={currentCoverUrl}
            preview={coverPreview}
            position={coverPosition}
            onPositionChange={setCoverPosition}
            onFileSelect={handleCoverSelect}
          />

          {coverFile && (
            <p className="text-xs text-green-700 font-medium">
              📸 {coverFile.name} ready — will upload when you save
            </p>
          )}
        </div>

        {/* EXTRA IMAGES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Gallery Photos</h2>
              <p className="text-sm text-gray-500 mt-1">
                Extra photos shown in the scrollable gallery on the trek page
              </p>
            </div>
            <label className="btn-primary flex items-center gap-2 cursor-pointer text-sm py-2 px-4">
              {uploadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <><Plus size={16} /> Add Photos</>
              )}
              <input type="file" accept="image/*" multiple className="hidden" disabled={uploadingMore}
                onChange={e => handleUploadMore(e.target.files)} />
            </label>
          </div>

          {trekImages.length === 0 ? (
            <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: '#e5e7eb' }}>
              <p className="text-4xl mb-2">📷</p>
              <p className="text-gray-400 text-sm">No extra photos yet — click Add Photos above</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {trekImages.map((img, i) => (
                <div key={img._id || i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => handleDeleteImage(img._id)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Trash2 size={20} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BEST SEASON */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Best Season</h2>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map(s => (
              <button key={s} type="button" onClick={() => toggleSeason(s)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                style={bestSeason.includes(s) ? sa : si}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">Highlights</h2>
            <button type="button" onClick={() => addItem(setHighlights)}
              className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-forest-700)' }}>
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {highlights.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="text" value={item} onChange={e => updateItem(setHighlights, i, e.target.value)}
                  placeholder={'Highlight ' + (i + 1)} className={'flex-1 ' + ic} style={is} />
                {highlights.length > 1 && (
                  <button type="button" onClick={() => removeItem(setHighlights, i)} className="text-red-400"><X size={18} /></button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* INCLUDES + EXCLUDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Included',     state: includes, setter: setIncludes, ph: 'e.g. All meals' },
            { label: 'Not Included', state: excludes, setter: setExcludes, ph: 'e.g. Flights' },
          ].map(({ label, state, setter, ph }) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-lg">{label}</h2>
                <button type="button" onClick={() => addItem(setter)}
                  className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-forest-700)' }}>
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {state.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={item} onChange={e => updateItem(setter, i, e.target.value)}
                      placeholder={ph} className={'flex-1 ' + ic} style={is} />
                    {state.length > 1 && (
                      <button type="button" onClick={() => removeItem(setter, i)} className="text-red-400"><X size={15} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PUBLISHING */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Publishing</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded"
                checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
              <div>
                <p className="text-sm font-medium text-gray-900">Published</p>
                <p className="text-xs text-gray-500">Visible on the public site</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded"
                checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
              <div>
                <p className="text-sm font-medium text-gray-900">Featured</p>
                <p className="text-xs text-gray-500">Show on homepage</p>
              </div>
            </label>
          </div>
        </div>

        {/* SAVE */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <Link to="/admin/treks" className="btn-secondary">Cancel</Link>
          <button type="button" onClick={handleSave} disabled={saving}
            className="btn-primary flex items-center gap-2">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {coverFile ? 'Uploading image...' : 'Saving...'}
              </>
            ) : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AdminEditTrek