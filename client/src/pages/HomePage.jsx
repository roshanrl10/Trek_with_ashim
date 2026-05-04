import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, ArrowRight, Shield, Award, Heart, Star } from 'lucide-react'
import { getSettings } from '../api/settings'
import { getTreks } from '../api/treks'
import TrekCard from '../components/trek/TrekCard'
import Spinner from '../components/common/Spinner'

// ─────────────────────────────────────────────
// HERO SECTION — image from admin settings only
// ─────────────────────────────────────────────
const HeroSection = ({ settings }) => {
  const heroTitle    = settings?.heroTitle    || 'Trek the Roof of the World'
  const heroSubtitle = settings?.heroSubtitle || 'Join Ashim for unforgettable journeys through the Himalayas'
  const titleLines   = heroTitle.split('\n')
  const hasImage     = settings?.heroImageUrl && settings.heroImageUrl.trim() !== ''

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: hasImage
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%), url(' + settings.heroImageUrl + ')'
          : 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
        backgroundSize: 'cover',
        backgroundPosition: settings.heroImagePosition || 'center center',
        backgroundAttachment: hasImage ? 'fixed' : 'scroll',
      }}
    >
      <div className="container-custom text-center px-4">

        <div
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
        >
          <MapPin size={14} />
          Based in Kathmandu, Nepal
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-heading)', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              {i === titleLines.length - 1
                ? <span style={{ color: '#86efac' }}>{line}</span>
                : <>{line}<br /></>
              }
            </span>
          ))}
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          {heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/treks" className="btn-primary text-lg py-4 px-8 flex items-center justify-center gap-2">
            Explore Treks <ArrowRight size={20} />
          </Link>
          <Link
            to="/about"
            className="text-lg py-4 px-8 rounded-lg font-semibold flex items-center justify-center gap-2"
            style={{ border: '2px solid rgba(255,255,255,0.5)', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            Meet Ashim
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/30 animate-pulse" />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// STATS SECTION
// ─────────────────────────────────────────────
const StatsSection = ({ settings }) => {
  const stats = [
    { number: settings?.statYears    || '—', label: 'Years Experience' },
    { number: settings?.statTreks    || '—', label: 'Treks Completed' },
    { number: settings?.statTrekkers || '—', label: 'Happy Trekkers' },
    { number: settings?.statRoutes   || '—', label: 'Routes Covered' },
  ]

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-forest-800)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: '#86efac' }}>
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
// FEATURED TREKS — uses shared TrekCard
// ─────────────────────────────────────────────
const FeaturedTreks = () => {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['featured-treks'],
    queryFn:  () => getTreks({ featured: 'true', limit: 3 }),
  })

  const { data: recentData } = useQuery({
    queryKey: ['recent-treks'],
    queryFn:  () => getTreks({ limit: 3 }),
    enabled:  !isLoading && !featuredData?.treks?.length,
  })

  const treks = featuredData?.treks?.length ? featuredData.treks : recentData?.treks || []

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-forest-600)' }}>
            Handpicked Routes
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Featured Treks
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Each route personally guided by Ashim — with deep local knowledge and memories that last a lifetime.
          </p>
        </div>

        {isLoading ? (
          <Spinner />
        ) : treks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🏔️</p>
            <p className="text-gray-400">Treks coming soon!</p>
          </div>
        ) : (
          // Uses the shared TrekCard — same component as /treks page
          // So image appears consistently in BOTH places
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map(trek => (
              <TrekCard key={trek._id} trek={trek} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/treks" className="btn-secondary inline-flex items-center gap-2">
            View All Treks <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// WHY SECTION
// ─────────────────────────────────────────────
const WhySection = ({ settings }) => {
  const reasons = [
    { icon: Shield, title: 'Safety First',      description: 'Certified wilderness first aid, oxygen equipment on high altitude treks, and 24/7 emergency support.' },
    { icon: Award,  title: 'Local Expertise',   description: 'Born and raised in Nepal, Ashim knows every trail, teahouse, and hidden viewpoint intimately.' },
    { icon: Heart,  title: 'Small Groups',      description: 'Maximum 12 trekkers per group — personalized attention, flexible pace, genuine experience.' },
    { icon: Star,   title: 'Authentic Culture', description: 'Stay in local teahouses, learn Nepali phrases, share meals with mountain families.' },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-forest-600)' }}>
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {settings?.whyTitle || 'Trek with Confidence'}
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            {settings?.whySubtitle || 'The principles that shape every trek Ashim leads'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map(reason => (
            <div key={reason.title} className="text-center group">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#f0fdf4' }}
              >
                <reason.icon size={28} style={{ color: 'var(--color-forest-700)' }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// CTA SECTION — image from admin settings only
// ─────────────────────────────────────────────
const CTASection = ({ settings }) => {
  const hasImage = settings?.ctaImageUrl && settings.ctaImageUrl.trim() !== ''

  return (
    <section
      className="py-24 text-white text-center relative overflow-hidden"
      style={{
        backgroundImage: hasImage
          ? 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(' + settings.ctaImageUrl + ')'
          : 'linear-gradient(135deg, #14532d 0%, #166634 100%)',
        backgroundSize: 'cover',
        backgroundPosition: settings.ctaImagePosition || 'center center',
      }}
    >
      <div className="container-custom relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}>
          {settings?.ctaTitle || 'Ready for Your Adventure?'}
        </h2>
        <p className="text-gray-300 text-xl mb-10 max-w-xl mx-auto">
          {settings?.ctaSubtitle || 'Contact Ashim today to plan your perfect Himalayan journey'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="btn-primary text-lg py-4 px-8">Plan My Trek</Link>
          <Link to="/gallery" className="text-lg py-4 px-8 rounded-lg font-semibold"
            style={{ border: '2px solid rgba(255,255,255,0.4)', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN HOMEPAGE
// ─────────────────────────────────────────────
const HomePage = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn:  getSettings,
    staleTime: 0,
  })

  if (isLoading && !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 animate-spin"
          style={{ borderTopColor: 'var(--color-forest-600)' }} />
      </div>
    )
  }

  return (
    <>
      <HeroSection  settings={settings} />
      <StatsSection settings={settings} />
      <FeaturedTreks />
      <WhySection   settings={settings} />
      <CTASection   settings={settings} />
    </>
  )
}

export default HomePage