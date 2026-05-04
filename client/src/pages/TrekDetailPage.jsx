import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Clock, TrendingUp, Users,
  CheckCircle, XCircle, ArrowLeft,
  ChevronRight, ChevronLeft, X
} from 'lucide-react'
import { getTrekBySlug } from '../api/treks'
import Spinner from '../components/common/Spinner'

const DIFFICULTY_STYLES = {
  Easy:      { bg: '#dcfce7', color: '#166534' },
  Moderate:  { bg: '#fef9c3', color: '#854d0e' },
  Strenuous: { bg: '#fee2e2', color: '#991b1b' },
  Extreme:   { bg: '#f3e8ff', color: '#6b21a8' },
}

// ─────────────────────────────────────────────
// LIGHTBOX — full screen image viewer
// ─────────────────────────────────────────────
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20"
      >
        <X size={24} />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]?.url || images[currentIndex]}
        alt={'Photo ' + (currentIndex + 1)}
        className="max-h-screen max-w-full object-contain px-16"
        style={{ objectPosition: images[currentIndex]?.position || 'center center' }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 text-white/60 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SCROLLABLE IMAGE GALLERY
// Shows cover + all extra images in a horizontal scroll
// ─────────────────────────────────────────────
const ImageGallery = ({ coverImage, images }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Combine cover image and extra images into one array
  const allImages = []
  if (coverImage?.url) allImages.push({
    url: coverImage.url,
    caption: 'Cover Photo',
    position: coverImage.position || 'center center',
  })
  if (images?.length) {
    images.forEach(img => {
      if (img?.url) allImages.push(img)
    })
  }

  if (allImages.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-white text-8xl"
        style={{ height: '420px', background: 'linear-gradient(135deg, #14532d, #166534)' }}
      >
        🏔️
      </div>
    )
  }

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % allImages.length)

  // Single image — show full width
  if (allImages.length === 1) {
    return (
      <>
        <div
          className="w-full cursor-pointer overflow-hidden"
          style={{ height: '480px' }}
          onClick={() => openLightbox(0)}
        >
          <img
            src={allImages[0].url}
            alt="Trek cover"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            style={{ objectPosition: allImages[0].position || 'center center' }}
          />
        </div>
        {lightboxIndex !== null && (
          <Lightbox
            images={allImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </>
    )
  }

  // Multiple images — hero + scrollable strip
  return (
    <>
      {/* Main hero image (first/cover) */}
      <div
        className="relative w-full cursor-pointer overflow-hidden"
        style={{ height: '420px' }}
        onClick={() => openLightbox(0)}
      >
        <img
          src={allImages[0].url}
          alt="Trek cover"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          style={{ objectPosition: allImages[0].position || 'center center' }}
        />
        {/* Photo count badge */}
        <div
          className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          📷 {allImages.length} photos — click to browse
        </div>
      </div>

      {/* Horizontal scrollable thumbnail strip */}
      <div
        className="flex gap-2 overflow-x-auto py-2 px-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#166534 #f1f1f1' }}
      >
        {allImages.map((img, i) => (
          <div
            key={i}
            onClick={() => openLightbox(i)}
            className="shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:opacity-90"
            style={{
              width: '100px',
              height: '70px',
              borderColor: i === 0 ? 'var(--color-forest-600)' : 'transparent',
            }}
          >
            <img
              src={img.url}
              alt={img.caption || 'Trek photo ' + (i + 1)}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────
// MAIN TREK DETAIL PAGE
// ─────────────────────────────────────────────
const TrekDetailPage = () => {
  const { slug } = useParams()

  const { data: trek, isLoading, isError } = useQuery({
    queryKey: ['trek', slug],
    queryFn:  () => getTrekBySlug(slug),
  })

  if (isLoading) return <Spinner />

  if (isError || !trek) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏔️</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Trek not found</h2>
          <Link to="/treks" className="btn-primary inline-block">Back to all treks</Link>
        </div>
      </div>
    )
  }

  const diffStyle = DIFFICULTY_STYLES[trek.difficulty] || DIFFICULTY_STYLES.Moderate

  return (
    <div className="bg-white min-h-screen">

      {/* ── IMAGE GALLERY ── */}
      <div className="relative">
        {/* Back button */}
        <Link
          to="/treks"
          className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <ArrowLeft size={16} /> All Treks
        </Link>

        <ImageGallery coverImage={trek.coverImage} images={trek.images} />
      </div>

      {/* ── TITLE OVERLAY BAR ── */}
      <div style={{ backgroundColor: 'var(--color-forest-800)' }} className="py-6">
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="badge text-sm font-semibold"
              style={{ backgroundColor: diffStyle.bg, color: diffStyle.color }}>
              {trek.difficulty}
            </span>
            <span className="badge text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <MapPin size={12} className="inline mr-1" />{trek.region}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {trek.title}
          </h1>
          {trek.tagline && (
            <p className="text-gray-300 text-lg mt-1">{trek.tagline}</p>
          )}
        </div>
      </div>

      {/* ── QUICK STATS BAR ── */}
      <div className="py-5 border-b border-gray-100 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock,      label: 'Duration',    value: trek.duration + ' days' },
              { icon: TrendingUp, label: 'Max Altitude', value: trek.maxAltitude || 'N/A' },
              { icon: MapPin,     label: 'Start Point',  value: trek.startPoint  || 'TBD' },
              { icon: Users,      label: 'Group Size',   value: trek.groupSize?.max ? 'Max ' + trek.groupSize.max : 'Flexible' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon size={20} style={{ color: 'var(--color-forest-600)' }} className="shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT — main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}>Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{trek.description}</p>
            </section>

            {/* Best Season */}
            {trek.bestSeason?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}>Best Season</h2>
                <div className="flex flex-wrap gap-2">
                  {trek.bestSeason.map(s => (
                    <span key={s} className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#f0fdf4', color: 'var(--color-forest-700)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Highlights */}
            {trek.highlights?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}>Trek Highlights</h2>
                <ul className="space-y-3">
                  {trek.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight size={18} className="shrink-0 mt-0.5"
                        style={{ color: 'var(--color-forest-600)' }} />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            {trek.itinerary?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}>Day by Day Itinerary</h2>
                <div className="space-y-4">
                  {trek.itinerary.map(day => (
                    <div key={day.day} className="flex gap-4 p-5 rounded-xl"
                      style={{ backgroundColor: '#f9fafb' }}>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: 'var(--color-forest-700)' }}
                      >
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900">{day.title}</h3>
                          {day.altitude && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <TrendingUp size={12} />{day.altitude}
                            </span>
                          )}
                        </div>
                        {day.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">{day.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Includes / Excludes */}
            {(trek.includes?.length > 0 || trek.excludes?.length > 0) && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}>What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trek.includes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle size={18} style={{ color: 'var(--color-forest-600)' }} />
                        Included
                      </h3>
                      <ul className="space-y-2">
                        {trek.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span style={{ color: 'var(--color-forest-600)' }}>✓</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {trek.excludes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <XCircle size={18} style={{ color: '#ef4444' }} />
                        Not Included
                      </h3>
                      <ul className="space-y-2">
                        {trek.excludes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span style={{ color: '#ef4444' }}>✗</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

          </div>

          {/* RIGHT — booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}>Book This Trek</h3>

              {trek.price && (
                <div className="mb-4">
                  <span className="text-3xl font-bold" style={{ color: 'var(--color-forest-700)' }}>
                    ${trek.price}
                  </span>
                  <span className="text-gray-500 text-sm"> / person</span>
                </div>
              )}

              <div className="space-y-3 mb-6 py-4 border-t border-b border-gray-100">
                {[
                  { label: 'Duration',    value: trek.duration + ' days' },
                  { label: 'Difficulty',  value: trek.difficulty },
                  { label: 'Region',      value: trek.region },
                  { label: 'Max Altitude', value: trek.maxAltitude || 'N/A' },
                  { label: 'Best Season',  value: trek.bestSeason?.join(', ') || 'Year round' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="btn-primary w-full text-center block mb-3">
                Enquire Now
              </Link>
              <Link to="/contact" className="btn-secondary w-full text-center block text-sm">
                Ask a Question
              </Link>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                {['✓ Free cancellation up to 30 days', '✓ Experienced local guide', '✓ Safety equipment included'].map(t => (
                  <p key={t} className="text-xs text-gray-500">{t}</p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TrekDetailPage