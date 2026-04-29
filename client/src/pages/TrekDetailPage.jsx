import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Clock, TrendingUp, Users, Calendar,
  CheckCircle, XCircle, ArrowLeft, ChevronRight
} from 'lucide-react'
import { getTrekBySlug } from '../api/treks'
import Spinner from '../components/common/Spinner'

// Difficulty badge colors (same as TrekCard)
const DIFFICULTY_STYLES = {
  Easy:      { bg: '#dcfce7', color: '#166534' },
  Moderate:  { bg: '#fef9c3', color: '#854d0e' },
  Strenuous: { bg: '#fee2e2', color: '#991b1b' },
  Extreme:   { bg: '#f3e8ff', color: '#6b21a8' },
}

const TrekDetailPage = () => {
  // useParams reads the URL — if URL is /treks/everest-base-camp
  // then params.slug = 'everest-base-camp'
  const { slug } = useParams()

  const { data: trek, isLoading, isError } = useQuery({
    queryKey: ['trek', slug],  // unique cache key per trek
    queryFn:  () => getTrekBySlug(slug),
  })

  if (isLoading) return <Spinner />

  if (isError || !trek) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏔️</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Trek not found</h2>
          <Link to="/treks" className="btn-primary mt-4 inline-block">
            Back to all treks
          </Link>
        </div>
      </div>
    )
  }

  const diffStyle = DIFFICULTY_STYLES[trek.difficulty] || DIFFICULTY_STYLES.Moderate

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO IMAGE ── */}
      <div
        className="relative h-96 md:h-[500px] flex items-end"
        style={{
          backgroundImage: trek.coverImage?.url
            ? `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%),
               url('${trek.coverImage.url}')`
            : `linear-gradient(135deg, #166534, #15803d)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Back button */}
        <Link
          to="/treks"
          className="absolute top-6 left-6 flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
        >
          <ArrowLeft size={16} />
          All Treks
        </Link>

        {/* Trek title overlay */}
        <div className="container-custom pb-10 text-white w-full">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="badge text-sm font-semibold"
              style={{ backgroundColor: diffStyle.bg, color: diffStyle.color }}
            >
              {trek.difficulty}
            </span>
            <span
              className="badge text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              <MapPin size={12} className="inline mr-1" />
              {trek.region}
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {trek.title}
          </h1>
          {trek.tagline && (
            <p className="text-gray-300 text-lg mt-2">{trek.tagline}</p>
          )}
        </div>
      </div>

      {/* ── QUICK STATS BAR ── */}
      <div
        className="py-6 text-white"
        style={{ backgroundColor: 'var(--color-forest-800)' }}
      >
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock,      label: 'Duration',     value: `${trek.duration} days` },
              { icon: TrendingUp, label: 'Max Altitude',  value: trek.maxAltitude || 'N/A' },
              { icon: MapPin,     label: 'Start Point',  value: trek.startPoint  || 'TBD' },
              { icon: Users,      label: 'Group Size',   value: trek.groupSize?.max ? `Max ${trek.groupSize.max}` : 'Flexible' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon size={20} style={{ color: '#86efac' }} className="shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-sm font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── LEFT COLUMN (main content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Overview
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {trek.description}
              </p>
            </section>

            {/* Highlights */}
            {trek.highlights?.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Trek Highlights
                </h2>
                <ul className="space-y-3">
                  {trek.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight
                        size={18}
                        className="shrink-0 mt-0.5"
                        style={{ color: 'var(--color-forest-600)' }}
                      />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            {trek.itinerary?.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Day by Day Itinerary
                </h2>
                <div className="space-y-4">
                  {trek.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="flex gap-4 p-5 rounded-xl"
                      style={{ backgroundColor: '#f9fafb' }}
                    >
                      {/* Day number circle */}
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
                              <TrendingUp size={12} />
                              {day.altitude}
                            </span>
                          )}
                        </div>
                        {day.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {day.description}
                          </p>
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
                <h2
                  className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  What's Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Included */}
                  {trek.includes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle size={18} style={{ color: 'var(--color-forest-600)' }} />
                        Included
                      </h3>
                      <ul className="space-y-2">
                        {trek.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span style={{ color: 'var(--color-forest-600)' }}>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Excluded */}
                  {trek.excludes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <XCircle size={18} style={{ color: '#ef4444' }} />
                        Not Included
                      </h3>
                      <ul className="space-y-2">
                        {trek.excludes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span style={{ color: '#ef4444' }}>✗</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </section>
            )}

            {/* Photo Gallery for this trek */}
            {trek.images?.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Photos
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {trek.images.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-square">
                      <img
                        src={img.url}
                        alt={img.caption || trek.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ── RIGHT COLUMN (booking card) ── */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 rounded-2xl p-6 shadow-lg border"
              style={{ borderColor: '#e5e7eb' }}
            >
              <h3
                className="text-xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Book This Trek
              </h3>

              {trek.price && (
                <div className="mb-4">
                  <span className="text-3xl font-bold" style={{ color: 'var(--color-forest-700)' }}>
                    ${trek.price}
                  </span>
                  <span className="text-gray-500 text-sm"> / person</span>
                </div>
              )}

              {/* Trek summary */}
              <div className="space-y-3 mb-6 py-4 border-t border-b" style={{ borderColor: '#f3f4f6' }}>
                {[
                  { label: 'Duration',   value: `${trek.duration} days` },
                  { label: 'Difficulty', value: trek.difficulty },
                  { label: 'Region',     value: trek.region },
                  { label: 'Max Altitude', value: trek.maxAltitude || 'N/A' },
                  { label: 'Best Season', value: trek.bestSeason?.join(', ') || 'Year round' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                to="/contact"
                className="btn-primary w-full text-center block mb-3"
              >
                Enquire Now
              </Link>
              <Link
                to="/contact"
                className="btn-secondary w-full text-center block text-sm"
              >
                Ask a Question
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t space-y-2" style={{ borderColor: '#f3f4f6' }}>
                {[
                  '✓ Free cancellation up to 30 days',
                  '✓ Experienced local guide',
                  '✓ Safety equipment included',
                ].map(item => (
                  <p key={item} className="text-xs text-gray-500">{item}</p>
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