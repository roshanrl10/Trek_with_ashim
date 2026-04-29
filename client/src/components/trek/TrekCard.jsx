import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, Star, ArrowRight, TrendingUp } from 'lucide-react'

// Difficulty badge colors
const DIFFICULTY_STYLES = {
  Easy:      { bg: '#dcfce7', color: '#166534' },
  Moderate:  { bg: '#fef9c3', color: '#854d0e' },
  Strenuous: { bg: '#fee2e2', color: '#991b1b' },
  Extreme:   { bg: '#f3e8ff', color: '#6b21a8' },
}

const TrekCard = ({ trek }) => {
  const diffStyle = DIFFICULTY_STYLES[trek.difficulty] || DIFFICULTY_STYLES.Moderate

  return (
    <div className="card group">

      {/* ── IMAGE ── */}
      <div className="relative overflow-hidden h-56">
        {trek.coverImage?.url ? (
          <img
            src={trek.coverImage.url}
            alt={trek.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Fallback if no image uploaded yet
          <div
            className="w-full h-full flex items-center justify-center text-white text-6xl"
            style={{ background: 'linear-gradient(135deg, #166534, #15803d)' }}
          >
            🏔️
          </div>
        )}

        {/* Difficulty badge — top right */}
        <div className="absolute top-3 right-3">
          <span
            className="badge text-xs font-semibold"
            style={{ backgroundColor: diffStyle.bg, color: diffStyle.color }}
          >
            {trek.difficulty}
          </span>
        </div>

        {/* Region label — bottom left */}
        <div className="absolute bottom-3 left-3">
          <span
            className="badge text-xs font-medium"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: 'white' }}
          >
            <MapPin size={10} className="inline mr-1" />
            {trek.region}
          </span>
        </div>

        {/* Featured ribbon — top left */}
        {trek.isFeatured && (
          <div
            className="absolute top-3 left-3 badge text-xs font-semibold"
            style={{ backgroundColor: '#f59e0b', color: 'white' }}
          >
            ⭐ Featured
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-5">

        {/* Title */}
        <h3
          className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {trek.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {trek.description}
        </p>

        {/* Quick stats row */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {trek.duration} days
          </span>
          {trek.maxAltitude && (
            <span className="flex items-center gap-1">
              <TrendingUp size={13} />
              {trek.maxAltitude}
            </span>
          )}
          {trek.groupSize?.max && (
            <span className="flex items-center gap-1">
              <Users size={13} />
              Max {trek.groupSize.max}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          {trek.price ? (
            <div>
              <span className="text-xs text-gray-400">From</span>
              <span
                className="text-lg font-bold ml-1"
                style={{ color: 'var(--color-forest-700)' }}
              >
                ${trek.price}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Contact for price</span>
          )}

          <Link
            to={`/treks/${trek.slug}`}
            className="flex items-center gap-1 text-sm font-semibold py-2 px-4 rounded-lg transition-all"
            style={{ color: 'var(--color-forest-700)', backgroundColor: '#f0fdf4' }}
          >
            Details
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default TrekCard