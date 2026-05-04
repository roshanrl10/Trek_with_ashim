import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Upload, CheckCircle } from 'lucide-react'
import { getSettings } from '../../api/settings'
import api from '../../api/axios'
import Spinner from '../../components/common/Spinner'

const IMAGE_POSITIONS = [
  { label: 'Top left',    value: 'left top' },
  { label: 'Top center',  value: 'center top' },
  { label: 'Top right',   value: 'right top' },
  { label: 'Middle left', value: 'left center' },
  { label: 'Center',      value: 'center center' },
  { label: 'Middle right',value: 'right center' },
  { label: 'Bottom left', value: 'left bottom' },
  { label: 'Bottom center', value: 'center bottom' },
  { label: 'Bottom right', value: 'right bottom' },
]

// Direct API call with FormData
const updateSettingsApi = async (formData) => {
  const { data } = await api.put('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

const Field = ({ label, name, register, placeholder, rows, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {rows ? (
      <textarea rows={rows} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
        style={{ borderColor: '#e5e7eb' }} {...register(name)} />
    ) : (
      <input type="text" placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
        style={{ borderColor: '#e5e7eb' }} {...register(name)} />
    )}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
)

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
          Image selected — click Save Settings to upload
        </div>
      )}

      {!preview && !currentUrl && (
        <p className="text-xs text-gray-400 mb-3">No image yet — homepage shows green background</p>
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
      <p className="text-xs text-gray-400 mt-2">Any format (JPG, PNG, WebP, HEIC) — recommended 1920x1080</p>
    </div>
  )
}

const AdminSiteSettings = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('seo')
  const [heroFile, setHeroFile] = useState(null)
  const [heroPreview, setHeroPreview] = useState(null)
  const [heroPosition, setHeroPosition] = useState('center center')
  const [ctaFile, setCtaFile] = useState(null)
  const [ctaPreview, setCtaPreview] = useState(null)
  const [ctaPosition, setCtaPosition] = useState('center center')

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn:  getSettings,
  })

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (settings) {
      reset(settings)
      setHeroPosition(settings.heroImagePosition || 'center center')
      setCtaPosition(settings.ctaImagePosition || 'center center')
    }
  }, [settings, reset])

  const mutation = useMutation({
    mutationFn: updateSettingsApi,
    onSuccess: (updated) => {
      queryClient.setQueryData(['settings'], updated)
      queryClient.invalidateQueries(['settings'])
      toast.success('Saved! Changes are live on homepage 🏔️')
      setHeroFile(null); setHeroPreview(null)
      setCtaFile(null);  setCtaPreview(null)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Save failed — check console')
      console.error(err)
    },
  })

  const handleHeroSelect = (file) => {
    setHeroFile(file)
    const r = new FileReader()
    r.onloadend = () => setHeroPreview(r.result)
    r.readAsDataURL(file)
  }

  const handleCtaSelect = (file) => {
    setCtaFile(file)
    const r = new FileReader()
    r.onloadend = () => setCtaPreview(r.result)
    r.readAsDataURL(file)
  }

  const onSubmit = (values) => {
    const fd = new FormData()

    // All text fields
    const fields = [
      'seoTitle','seoDescription',
      'heroTitle','heroSubtitle',
      'statYears','statTreks','statTrekkers','statRoutes',
      'whyTitle','whySubtitle',
      'ctaTitle','ctaSubtitle',
      'footerTagline','footerPhone','footerEmail','footerAddress',
      'instagramUrl','facebookUrl','youtubeUrl','whatsappNumber',
    ]
    fields.forEach(f => {
      if (values[f] !== undefined && values[f] !== null) fd.append(f, values[f])
    })

    // Image files — names must match backend multer field names exactly
    if (heroFile) fd.append('heroImage', heroFile)
    if (ctaFile)  fd.append('ctaImage',  ctaFile)
    fd.append('heroImagePosition', heroPosition)
    fd.append('ctaImagePosition', ctaPosition)

    mutation.mutate(fd)
  }

  if (isLoading) return <Spinner />

  const tabs = [
    { id: 'seo',    label: 'SEO' },
    { id: 'hero',   label: '🏔️ Hero' },
    { id: 'stats',  label: '📊 Stats' },
    { id: 'why',    label: '✅ Why Us' },
    { id: 'cta',    label: '📣 CTA' },
    { id: 'footer', label: '🦶 Footer' },
    { id: 'social', label: '📱 Social' },
  ]

  const activeStyle   = { backgroundColor: 'var(--color-forest-700)', color: 'white', borderColor: 'var(--color-forest-700)' }
  const inactiveStyle = { backgroundColor: 'white', color: '#374151', borderColor: '#e5e7eb' }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
          Site Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Every change here goes live on the public website</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
            style={activeTab === tab.id ? activeStyle : inactiveStyle}>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {activeTab === 'seo' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">SEO Settings</h2>
            <Field label="Site Title" name="seoTitle" register={register} placeholder="Trek with Ashim — Your Himalayan Guide" />
            <Field label="Meta Description" name="seoDescription" register={register} placeholder="Explore Nepal with Ashim..." rows={3} />
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Hero Section</h2>
              <p className="text-sm text-gray-500 mt-1">Full-screen banner at the top of the homepage</p>
            </div>
            <Field label="Main Headline" name="heroTitle" register={register}
              placeholder="Trek the Roof of the World"
              hint="Press Enter for a new line — the last line shows in green" />
            <Field label="Sub Headline" name="heroSubtitle" register={register}
              placeholder="Join Ashim for unforgettable Himalayan journeys" />
            <DraggableImageField
              label="Hero Background Image"
              currentUrl={settings?.heroImageUrl}
              preview={heroPreview}
              onFileSelect={handleHeroSelect}
              position={heroPosition}
              onPositionChange={setHeroPosition}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Stats Bar</h2>
              <p className="text-sm text-gray-500 mt-1">Dark green bar below the hero</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Years Experience" name="statYears"    register={register} placeholder="10+" />
              <Field label="Treks Completed"  name="statTreks"    register={register} placeholder="200+" />
              <Field label="Happy Trekkers"   name="statTrekkers" register={register} placeholder="500+" />
              <Field label="Routes Covered"   name="statRoutes"   register={register} placeholder="15+" />
            </div>
          </div>
        )}

        {activeTab === 'why' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Why Trek with Ashim</h2>
            <Field label="Section Title"    name="whyTitle"    register={register} placeholder="Trek with Confidence" />
            <Field label="Section Subtitle" name="whySubtitle" register={register} placeholder="The principles behind every trek" />
          </div>
        )}

        {activeTab === 'cta' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Call to Action Banner</h2>
              <p className="text-sm text-gray-500 mt-1">Full-width banner near the bottom of the homepage</p>
            </div>
            <Field label="CTA Title"    name="ctaTitle"    register={register} placeholder="Ready for Your Adventure?" />
            <Field label="CTA Subtitle" name="ctaSubtitle" register={register} placeholder="Contact Ashim to plan your journey" />
            <DraggableImageField
              label="CTA Background Image"
              currentUrl={settings?.ctaImageUrl}
              preview={ctaPreview}
              onFileSelect={handleCtaSelect}
              position={ctaPosition}
              onPositionChange={setCtaPosition}
            />
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Footer</h2>
            <Field label="Tagline"  name="footerTagline" register={register} placeholder="Your trusted trekking guide in Nepal." />
            <Field label="Phone"    name="footerPhone"   register={register} placeholder="+977 98XXXXXXXX" />
            <Field label="Email"    name="footerEmail"   register={register} placeholder="ashim@trekwithashim.com" />
            <Field label="Address"  name="footerAddress" register={register} placeholder="Thamel, Kathmandu, Nepal" />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Social Media</h2>
            <Field label="Instagram URL"   name="instagramUrl"   register={register} placeholder="https://instagram.com/trekwithashim" />
            <Field label="Facebook URL"    name="facebookUrl"    register={register} placeholder="https://facebook.com/trekwithashim" />
            <Field label="YouTube URL"     name="youtubeUrl"     register={register} placeholder="https://youtube.com/@trekwithashim" />
            <Field label="WhatsApp Number" name="whatsappNumber" register={register} placeholder="+9779812345678" />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between pb-8">
          <p className="text-sm text-gray-400">
            {(heroFile || ctaFile)
              ? '📸 Image ready — will upload when you save'
              : 'Changes go live immediately after saving'
            }
          </p>
          <button type="submit" disabled={mutation.isPending}
            className="btn-primary flex items-center gap-2 min-w-36 justify-center">
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default AdminSiteSettings