import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, Star, ArrowRight, Shield, Award, Heart } from 'lucide-react'

// ─────────────────────────────────────────────
// HERO SECTION
// Full screen with mountain background image
// ─────────────────────────────────────────────
const HeroSection = () => (
  <section
    className="relative min-h-screen flex items-center justify-center text-white"
    style={{
      // Everest region photo from Unsplash — free to use
      backgroundImage: `linear-gradient(
        to bottom,
        rgba(0,0,0,0.3) 0%,
        rgba(0,0,0,0.5) 60%,
        rgba(0,0,0,0.7) 100%
      ), url('https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=1800&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed', // parallax scroll effect
    }}
  >
    <div className="container-custom text-center px-4">

      {/* Small label above headline */}
      <div
        className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
      >
        <MapPin size={14} />
        Based in Kathmandu, Nepal
      </div>

      {/* Main headline */}
      <h1
        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        style={{ fontFamily: 'var(--font-heading)', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
      >
        Trek the Roof<br />
        <span style={{ color: '#86efac' }}>of the World</span>
      </h1>

      {/* Sub headline */}
      <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
        Join Ashim — your experienced Nepali guide — for unforgettable
        journeys through the Himalayas
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/treks"
          className="btn-primary text-lg py-4 px-8 flex items-center justify-center gap-2"
        >
          Explore Treks
          <ArrowRight size={20} />
        </Link>
        <Link
          to="/about"
          className="text-lg py-4 px-8 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            border: '2px solid rgba(255,255,255,0.5)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
        >
          Meet Ashim
        </Link>
      </div>

    </div>

    {/* Scroll indicator at the bottom */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
      <span className="text-xs tracking-widest uppercase">Scroll</span>
      <div className="w-px h-8 bg-white/30 animate-pulse" />
    </div>
  </section>
)

// ─────────────────────────────────────────────
// STATS SECTION
// Quick numbers that build trust
// ─────────────────────────────────────────────
const StatsSection = () => {
  const stats = [
    { number: '10+',  label: 'Years Experience' },
    { number: '200+', label: 'Treks Completed' },
    { number: '500+', label: 'Happy Trekkers' },
    { number: '15+',  label: 'Routes Covered' },
  ]

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-forest-800)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="text-center text-white">
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: '#86efac' }}
              >
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FEATURED TREKS SECTION
// Shows 3 hardcoded treks for now
// Later we'll replace with real API data
// ─────────────────────────────────────────────

// A single trek card component
const TrekCard = ({ trek }) => {
  // Color coding by difficulty
  const difficultyColor = {
    Easy:      { bg: '#dcfce7', text: '#166534' },
    Moderate:  { bg: '#fef9c3', text: '#854d0e' },
    Strenuous: { bg: '#fee2e2', text: '#991b1b' },
    Extreme:   { bg: '#f3e8ff', text: '#6b21a8' },
  }

  const colors = difficultyColor[trek.difficulty] || difficultyColor.Moderate

  return (
    <div className="card group cursor-pointer">
      {/* Trek Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={trek.image}
          alt={trek.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Difficulty badge on top of image */}
        <div className="absolute top-3 right-3">
          <span
            className="badge text-xs font-semibold"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {trek.difficulty}
          </span>
        </div>
        {/* Region label bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="badge text-xs" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}>
            <MapPin size={10} className="inline mr-1" />
            {trek.region}
          </span>
        </div>
      </div>

      {/* Trek Info */}
      <div className="p-5">
        <h3
          className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {trek.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {trek.description}
        </p>

        {/* Quick info row */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {trek.duration} days
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            Max {trek.groupSize}
          </span>
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            {trek.rating}
          </span>
        </div>

        {/* View Details link */}
        <Link
          to={`/treks/${trek.slug}`}
          className="flex items-center justify-between w-full font-semibold text-sm py-2 px-4 rounded-lg transition-colors"
          style={{ color: 'var(--color-forest-700)', backgroundColor: '#f0fdf4' }}
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

const FeaturedTreks = () => {
  // Hardcoded sample treks — we'll replace with API data in a later lesson
  const treks = [
    {
      slug:        'everest-base-camp',
      title:       'Everest Base Camp Trek',
      description: 'Walk in the footsteps of legends to the base of the world\'s highest mountain through the heart of Sherpa country.',
      region:      'Everest',
      difficulty:  'Strenuous',
      duration:    14,
      groupSize:   12,
      rating:      4.9,
      image:       'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80',
    },
    {
      slug:        'annapurna-circuit',
      title:       'Annapurna Circuit Trek',
      description: 'One of the world\'s greatest treks, circling the entire Annapurna massif through diverse landscapes.',
      region:      'Annapurna',
      difficulty:  'Moderate',
      duration:    18,
      groupSize:   10,
      rating:      4.8,
      image:       'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80',
    },
    {
      slug:        'langtang-valley',
      title:       'Langtang Valley Trek',
      description: 'Explore the "Valley of Glaciers" close to Kathmandu, rich in Tamang culture and stunning mountain views.',
      region:      'Langtang',
      difficulty:  'Moderate',
      duration:    10,
      groupSize:   10,
      rating:      4.7,
      image:       'https://images.unsplash.com/photo-1585016495481-91613e9f1e55?w=600&q=80',
    },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-forest-600)' }}
          >
            Handpicked Routes
          </span>
          <h2
            className="text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Featured Treks
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Each route personally guided by Ashim — with deep local knowledge,
            full safety support, and memories that last a lifetime.
          </p>
        </div>

        {/* Trek Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treks.map(trek => (
            <TrekCard key={trek.slug} trek={trek} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/treks" className="btn-secondary inline-flex items-center gap-2">
            View All Treks
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// WHY TREK WITH ASHIM SECTION
// Trust-building points
// ─────────────────────────────────────────────
const WhySection = () => {
  const reasons = [
    {
      icon:        Shield,
      title:       'Safety First',
      description: 'Certified wilderness first aid, oxygen equipment on high altitude treks, and 24/7 emergency support.',
    },
    {
      icon:        Award,
      title:       'Local Expertise',
      description: 'Born and raised in Nepal, Ashim knows every trail, teahouse, and hidden viewpoint intimately.',
    },
    {
      icon:        Heart,
      title:       'Small Groups',
      description: 'Maximum 12 trekkers per group — personalized attention, flexible pace, genuine experience.',
    },
    {
      icon:        Star,
      title:       'Authentic Culture',
      description: 'Stay in local teahouses, learn Nepali phrases, share meals with mountain families.',
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-forest-600)' }}
          >
            Why Choose Us
          </span>
          <h2
            className="text-4xl font-bold text-gray-900 mt-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Trek with Confidence
          </h2>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map(reason => (
            <div key={reason.title} className="text-center group">
              {/* Icon circle */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#f0fdf4' }}
              >
                <reason.icon size={28} style={{ color: 'var(--color-forest-700)' }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// CALL TO ACTION SECTION
// Bottom banner encouraging booking
// ─────────────────────────────────────────────
const CTASection = () => (
  <section
    className="py-24 text-white text-center relative overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
        url('https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=1600&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="container-custom relative z-10">
      <h2
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Ready for Your Adventure?
      </h2>
      <p className="text-gray-300 text-xl mb-10 max-w-xl mx-auto">
        Contact Ashim today to plan your perfect Himalayan journey
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/contact" className="btn-primary text-lg py-4 px-8">
          Plan My Trek
        </Link>
        <Link
          to="/gallery"
          className="text-lg py-4 px-8 rounded-lg font-semibold transition-all"
          style={{
            border: '2px solid rgba(255,255,255,0.4)',
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
        >
          View Gallery
        </Link>
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────
// MAIN HOMEPAGE — assembles all sections
// ─────────────────────────────────────────────
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedTreks />
      <WhySection />
      <CTASection />
    </>
  )
}

export default HomePage