import { Link } from 'react-router-dom'
import { Award, Shield, Heart, Users, Mountain, ArrowRight } from 'lucide-react'

const AboutPage = () => {

  const certifications = [
    'Nepal Mountaineering Association (NMA) Licensed Guide',
    'Wilderness First Responder (WFR) Certified',
    'High Altitude Trekking Certificate',
    'Tourism Board of Nepal Licensed',
    'English Speaking Trekking Guide',
  ]

  const experiences = [
    { year: '2014', event: 'Started guiding in the Everest region' },
    { year: '2016', event: 'Completed first Manaslu Circuit guide' },
    { year: '2018', event: 'Obtained WFR certification in Kathmandu' },
    { year: '2020', event: 'Guided 500th trekker on Annapurna Circuit' },
    { year: '2022', event: 'Launched Trek with Ashim platform' },
    { year: '2024', event: 'Over 200 successful treks completed' },
  ]

  const values = [
    {
      icon: Shield,
      title: 'Safety Above All',
      desc: 'Every decision on the trail prioritizes your safety. Ashim carries emergency oxygen, a first aid kit, and satellite communication on every high altitude trek.',
    },
    {
      icon: Heart,
      title: 'Genuine Passion',
      desc: 'Born and raised in the shadow of the Himalayas, Ashim\'s love for the mountains is not a job — it\'s a way of life passed down through generations.',
    },
    {
      icon: Users,
      title: 'Personal Connection',
      desc: 'Small groups mean every trekker gets personal attention. Ashim remembers every client\'s name, pace, and preference.',
    },
    {
      icon: Award,
      title: 'Local Expertise',
      desc: 'Deep roots in Nepali mountain communities mean access to authentic experiences — hidden trails, local teahouses, and genuine cultural moments.',
    },
  ]

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <div
        className="relative py-28 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
            url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-custom text-center">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Meet Ashim
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Your trusted guide to Nepal's most breathtaking landscapes —
            with over a decade of mountain experience
          </p>
        </div>
      </div>

      {/* ── INTRO SECTION ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-square max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80"
                  alt="Ashim - Trek Guide"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div
                className="absolute bottom-6 right-6 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <Mountain size={24} style={{ color: 'var(--color-forest-700)' }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">10+ Years</p>
                    <p className="text-gray-500 text-xs">Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-forest-600)' }}
              >
                About Me
              </span>
              <h2
                className="text-4xl font-bold text-gray-900 mt-2 mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                A Life Lived in the Mountains
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  I was born in a small village near the Langtang Valley, where the
                  Himalayas were not a destination — they were home. Growing up, I watched
                  trekkers arrive wide-eyed and leave transformed, and I knew I wanted to
                  be part of that journey.
                </p>
                <p>
                  After completing my guiding certification with the Nepal Mountaineering
                  Association, I spent years learning every trail, teahouse, and weather
                  pattern in Nepal's major trekking regions. I've guided over 500 trekkers
                  from more than 40 countries through the world's greatest mountain landscapes.
                </p>
                <p>
                  For me, trekking is not just about reaching a destination. It's about the
                  conversations at teahouses, the unexpected sunrises, the friendships formed
                  on difficult passes. Every trek I lead is unique — and I treat it that way.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                  Trek with Me
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section-padding" style={{ backgroundColor: '#f9fafb' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              How I Guide
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              The principles that shape every trek I lead
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#f0fdf4' }}
                >
                  <v.icon size={24} style={{ color: 'var(--color-forest-700)' }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Certifications */}
            <div>
              <h2
                className="text-3xl font-bold text-gray-900 mb-8"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Certifications
              </h2>
              <ul className="space-y-4">
                {certifications.map(cert => (
                  <li key={cert} className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: '#dcfce7' }}
                    >
                      <span style={{ color: 'var(--color-forest-700)', fontSize: '12px' }}>✓</span>
                    </div>
                    <span className="text-gray-700">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div>
              <h2
                className="text-3xl font-bold text-gray-900 mb-8"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                My Journey
              </h2>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={i} className="flex gap-5">
                    {/* Year + line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: 'var(--color-forest-700)' }}
                      >
                        {exp.year}
                      </div>
                      {i < experiences.length - 1 && (
                        <div
                          className="w-0.5 flex-1 mt-2"
                          style={{ backgroundColor: '#dcfce7', minHeight: '20px' }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-gray-700 font-medium">{exp.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 text-white text-center"
        style={{ backgroundColor: 'var(--color-forest-800)' }}
      >
        <div className="container-custom">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ready to Trek Together?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Whether it's your first trek or your fiftieth, I'll make it unforgettable
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-8">
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default AboutPage