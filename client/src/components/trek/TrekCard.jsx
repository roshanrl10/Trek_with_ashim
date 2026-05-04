import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, ArrowRight, TrendingUp } from 'lucide-react'

const DIFFICULTY_STYLES = {
  Easy:      { bg: '#dcfce7', color: '#166534' },
  Moderate:  { bg: '#fef9c3', color: '#854d0e' },
  Strenuous: { bg: '#fee2e2', color: '#991b1b' },
  Extreme:   { bg: '#f3e8ff', color: '#6b21a8' },
}

const TrekCard = ({ trek }) => {
  const diff = DIFFICULTY_STYLES[trek.difficulty] || DIFFICULTY_STYLES.Moderate

  // coverImage is stored as { url: string, publicId: string } in MongoDB
  // Read the url field — this is the Cloudinary URL
  const imageUrl = trek?.coverImage?.url
    ? trek.coverImage.url
    : null

  return (
    <div className="card group">

      {/* IMAGE AREA */}
      <div
        className="relative overflow-hidden"
        style={{ height: '224px' }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={trek.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-6xl"
            style={{ background: 'linear-gradient(135deg, #166534, #15803d)' }}
          >
            🏔️
          </div>
        )}

        {/* Featured badge */}
        {trek.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="badge text-xs font-semibold"
              style={{ backgroundColor: '#f59e0b', color: 'white' }}>
              ⭐ Featured
            </span>
          </div>
        )}

        {/* Difficulty badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="badge text-xs font-semibold"
            style={{ backgroundColor: diff.bg, color: diff.color }}>
            {trek.difficulty}
          </span>
        </div>

        {/* Region badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="badge text-xs font-medium"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: 'white' }}>
            <MapPin size={10} className="inline mr-1" />
            {trek.region}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3
          className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-700 transition-colors"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {trek.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {trek.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {trek.duration} days
          </span>
          {trek.maxAltitude && (
            <span className="flex items-center gap-1">
              <TrendingUp size={13} /> {trek.maxAltitude}
            </span>
          )}
          {trek.groupSize?.max && (
            <span className="flex items-center gap-1">
              <Users size={13} /> Max {trek.groupSize.max}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {trek.price ? (
            <div>
              <span className="text-xs text-gray-400">From</span>
              <span className="text-lg font-bold ml-1" style={{ color: 'var(--color-forest-700)' }}>
                ${trek.price}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Contact for price</span>
          )}
          <Link
            to={'/treks/' + trek.slug}
            className="flex items-center gap-1 text-sm font-semibold py-2 px-4 rounded-lg"
            style={{ color: 'var(--color-forest-700)', backgroundColor: '#f0fdf4' }}
          >
            View Trek <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TrekCard