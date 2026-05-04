import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, X, Upload, CheckCircle } from 'lucide-react'
import api from '../../api/axios'
import Spinner from '../../components/common/Spinner'

// Direct API calls — avoids react-hook-form issues with complex nested data
const fetchAbout = async () => {
  const { data } = await api.get('/about')
  return data
}

const saveAbout = async (formData) => {
  const { data } = await api.put('/about', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// Simple input component
const Field = ({ label, value, onChange, placeholder, rows, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {rows ? (
      <textarea
        rows={rows}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
        style={{ borderColor: '#e5e7eb' }}
      />
    ) : (
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
        style={{ borderColor: '#e5e7eb' }}
      />
    )}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
)

const AdminAbout = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('profile')

  // All fields managed in local state — makes editing feel instant
  const [name,          setName]          = useState('')
  const [tagline,       setTagline]       = useState('')
  const [heroTitle,     setHeroTitle]     = useState('')
  const [heroSubtitle,  setHeroSubtitle]  = useState('')
  const [bioParagraphs, setBioParagraphs] = useState([''])
  const [certifications, setCertifications] = useState([''])
  const [timeline,      setTimeline]      = useState([{ year: '', event: '' }])
  const [yearsExp,      setYearsExp]      = useState('')
  const [totalTreks,    setTotalTreks]    = useState('')
  const [countries,     setCountries]     = useState('')
  const [ctaTitle,      setCtaTitle]      = useState('')
  const [ctaSubtitle,   setCtaSubtitle]   = useState('')

  // Profile image
  const [profileFile,    setProfileFile]    = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [currentProfileUrl, setCurrentProfileUrl] = useState(null)

  const { data: about, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn:  fetchAbout,
  })

  // Load all data into local state when fetched
  useEffect(() => {
    if (!about) return
    setName(about.name         || '')
    setTagline(about.tagline   || '')
    setHeroTitle(about.heroTitle   || '')
    setHeroSubtitle(about.heroSubtitle || '')
    setBioParagraphs(about.bioParagraphs?.length ? about.bioParagraphs : [''])
    setCertifications(about.certifications?.length ? about.certifications : [''])
    setTimeline(about.timeline?.length ? about.timeline : [{ year: '', event: '' }])
    setYearsExp(about.yearsExp   || '')
    setTotalTreks(about.totalTreks || '')
    setCountries(about.countries  || '')
    setCtaTitle(about.ctaTitle    || '')
    setCtaSubtitle(about.ctaSubtitle || '')
    setCurrentProfileUrl(about.profileImageUrl || null)
  }, [about])

  const mutation = useMutation({
    mutationFn: saveAbout,
    onSuccess: (updated) => {
      queryClient.setQueryData(['about'], updated)
      queryClient.invalidateQueries(['about'])
      toast.success('About page saved! 🏔️')
      setProfileFile(null)
      setProfilePreview(null)
      if (updated.profileImageUrl) setCurrentProfileUrl(updated.profileImageUrl)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to save')
      console.error(err)
    },
  })

  const handleProfileSelect = (file) => {
    setProfileFile(file)
    const r = new FileReader()
    r.onloadend = () => setProfilePreview(r.result)
    r.readAsDataURL(file)
  }

  // List helpers
  const addItem    = (setter) => setter(prev => [...prev, ''])
  const removeItem = (setter, i) => setter(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (setter, i, v) => setter(prev => prev.map((item, idx) => idx === i ? v : item))

  const addTimeline    = () => setTimeline(prev => [...prev, { year: '', event: '' }])
  const removeTimeline = (i) => setTimeline(prev => prev.filter((_, idx) => idx !== i))
  const updateTimeline = (i, field, v) =>
    setTimeline(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: v } : item))

  const handleSave = () => {
    const fd = new FormData()

    // Text fields
    fd.append('name',        name)
    fd.append('tagline',     tagline)
    fd.append('heroTitle',   heroTitle)
    fd.append('heroSubtitle', heroSubtitle)
    fd.append('yearsExp',    yearsExp)
    fd.append('totalTreks',  totalTreks)
    fd.append('countries',   countries)
    fd.append('ctaTitle',    ctaTitle)
    fd.append('ctaSubtitle', ctaSubtitle)

    // Arrays as JSON strings
    fd.append('bioParagraphs',  JSON.stringify(bioParagraphs.filter(p => p.trim())))
    fd.append('certifications', JSON.stringify(certifications.filter(c => c.trim())))
    fd.append('timeline',       JSON.stringify(timeline.filter(t => t.year && t.event)))

    // Profile image file
    if (profileFile) fd.append('profileImage', profileFile)

    mutation.mutate(fd)
  }

  if (isLoading) return <Spinner />

  const tabs = [
    { id: 'profile',  label: '👤 Profile' },
    { id: 'bio',      label: '📝 Bio' },
    { id: 'certs',    label: '🏅 Certifications' },
    { id: 'timeline', label: '📅 Timeline' },
    { id: 'stats',    label: '📊 Stats' },
    { id: 'cta',      label: '📣 CTA' },
  ]

  const activeStyle   = { backgroundColor: 'var(--color-forest-700)', color: 'white', borderColor: 'var(--color-forest-700)' }
  const inactiveStyle = { backgroundColor: 'white', color: '#374151', borderColor: '#e5e7eb' }
  const inputClass    = 'w-full px-4 py-3 rounded-xl border text-sm outline-none'
  const inputStyle    = { borderColor: '#e5e7eb' }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
          About Page
        </h1>
        <p className="text-gray-500 text-sm mt-1">Edit every section of your public about page</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
            style={activeTab === tab.id ? activeStyle : inactiveStyle}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">Profile</h2>

          {/* Profile photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            {(profilePreview || currentProfileUrl) && (
              <div className="w-36 h-36 rounded-2xl overflow-hidden mb-3">
                <img
                  src={profilePreview || currentProfileUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {profilePreview && (
              <p className="flex items-center gap-2 text-sm text-green-700 font-medium mb-2">
                <CheckCircle size={15} /> New photo ready — click Save to upload
              </p>
            )}
            <label
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
              style={{ borderColor: '#d1d5db' }}
            >
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {profilePreview || currentProfileUrl ? 'Change photo' : 'Upload photo'}
              </span>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => { if (e.target.files[0]) handleProfileSelect(e.target.files[0]) }} />
            </label>
          </div>

          <Field label="Name"         value={name}         onChange={setName}        placeholder="Ashim" />
          <Field label="Tagline"      value={tagline}      onChange={setTagline}     placeholder="A Life Lived in the Mountains" />
          <Field label="Hero Title"   value={heroTitle}    onChange={setHeroTitle}   placeholder="Meet Ashim" />
          <Field label="Hero Subtitle" value={heroSubtitle} onChange={setHeroSubtitle} placeholder="Your trusted guide to Nepal's most breathtaking landscapes" />
        </div>
      )}

      {/* ── BIO TAB ── */}
      {activeTab === 'bio' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Bio Paragraphs</h2>
              <p className="text-sm text-gray-500 mt-1">Each entry becomes one paragraph on the about page</p>
            </div>
            <button type="button" onClick={() => addItem(setBioParagraphs)}
              className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg"
              style={{ color: 'var(--color-forest-700)', backgroundColor: '#f0fdf4' }}>
              <Plus size={15} /> Add Paragraph
            </button>
          </div>

          {bioParagraphs.map((para, i) => (
            <div key={i} className="flex gap-3">
              <textarea
                rows={4}
                value={para}
                onChange={e => updateItem(setBioParagraphs, i, e.target.value)}
                placeholder={'Paragraph ' + (i + 1) + ' — write about yourself...'}
                className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={inputStyle}
              />
              {bioParagraphs.length > 1 && (
                <button type="button" onClick={() => removeItem(setBioParagraphs, i)}
                  className="text-red-400 hover:text-red-600 self-start mt-2">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── CERTIFICATIONS TAB ── */}
      {activeTab === 'certs' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Certifications</h2>
              <p className="text-sm text-gray-500 mt-1">List your qualifications and licenses</p>
            </div>
            <button type="button" onClick={() => addItem(setCertifications)}
              className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg"
              style={{ color: 'var(--color-forest-700)', backgroundColor: '#f0fdf4' }}>
              <Plus size={15} /> Add
            </button>
          </div>

          {certifications.map((cert, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                value={cert}
                onChange={e => updateItem(setCertifications, i, e.target.value)}
                placeholder={'Certification ' + (i + 1) + ' — e.g. NMA Licensed Guide'}
                className={'flex-1 ' + inputClass}
                style={inputStyle}
              />
              {certifications.length > 1 && (
                <button type="button" onClick={() => removeItem(setCertifications, i)}
                  className="text-red-400 hover:text-red-600">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TIMELINE TAB ── */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Journey Timeline</h2>
              <p className="text-sm text-gray-500 mt-1">Key milestones in your guiding career</p>
            </div>
            <button type="button" onClick={addTimeline}
              className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg"
              style={{ color: 'var(--color-forest-700)', backgroundColor: '#f0fdf4' }}>
              <Plus size={15} /> Add Event
            </button>
          </div>

          {timeline.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                value={item.year}
                onChange={e => updateTimeline(i, 'year', e.target.value)}
                placeholder="Year"
                className="w-24 shrink-0 px-3 py-3 rounded-xl border text-sm outline-none"
                style={inputStyle}
              />
              <input
                type="text"
                value={item.event}
                onChange={e => updateTimeline(i, 'event', e.target.value)}
                placeholder="What happened? e.g. Started guiding in Everest region"
                className={'flex-1 ' + inputClass}
                style={inputStyle}
              />
              {timeline.length > 1 && (
                <button type="button" onClick={() => removeTimeline(i)}
                  className="text-red-400 hover:text-red-600 shrink-0">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── STATS TAB ── */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Experience Stats</h2>
            <p className="text-sm text-gray-500 mt-1">Numbers shown on your about page</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Years Experience" value={yearsExp}   onChange={setYearsExp}   placeholder="10+" />
            <Field label="Total Treks"      value={totalTreks} onChange={setTotalTreks} placeholder="200+" />
            <Field label="Countries Served" value={countries}  onChange={setCountries}  placeholder="40+" />
          </div>
        </div>
      )}

      {/* ── CTA TAB ── */}
      {activeTab === 'cta' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Bottom CTA Section</h2>
            <p className="text-sm text-gray-500 mt-1">The call-to-action at the bottom of your about page</p>
          </div>
          <Field label="CTA Title"    value={ctaTitle}    onChange={setCtaTitle}    placeholder="Ready to Trek Together?" />
          <Field label="CTA Subtitle" value={ctaSubtitle} onChange={setCtaSubtitle} placeholder="Whether it's your first trek or your fiftieth..." />
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex items-center justify-between pb-8">
        <p className="text-sm text-gray-400">
          {profileFile ? '📸 New photo selected — save to upload' : 'All changes go live immediately after saving'}
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending}
          className="btn-primary flex items-center gap-2 min-w-36 justify-center"
        >
          {mutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : 'Save About Page'}
        </button>
      </div>

    </div>
  )
}

export default AdminAbout