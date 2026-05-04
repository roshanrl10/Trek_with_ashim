import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Mountain, Mail, Phone, MapPin } from 'lucide-react'
import { getSettings } from '../../api/settings'

const Footer = () => {
  // Fetch settings from database — social links and contact info are stored here
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn:  getSettings,
    staleTime: 5 * 60 * 1000,
  })

  // Social links from admin settings — only show button if link is set
  const socialLinks = [
    { label: 'Instagram', url: settings?.instagramUrl, color: '#E1306C' },
    { label: 'Facebook',  url: settings?.facebookUrl,  color: '#1877F2' },
    { label: 'YouTube',   url: settings?.youtubeUrl,   color: '#FF0000' },
  ].filter(s => s.url && s.url.trim() !== '') // hide if not set by admin

  // WhatsApp link
  const whatsappUrl = settings?.whatsappNumber
    ? 'https://wa.me/' + settings.whatsappNumber.replace(/[^0-9]/g, '')
    : null

  // Contact info from settings — fall back to placeholder if not set
  const phone   = settings?.footerPhone   || ''
  const email   = settings?.footerEmail   || ''
  const address = settings?.footerAddress || ''
  const tagline = settings?.footerTagline || 'Your trusted trekking guide in Nepal.'

  return (
    <footer className="text-white" style={{ backgroundColor: '#1a2e1a' }}>

      {/* ── MAIN CONTENT ── */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <Mountain size={28} style={{ color: '#86efac' }} />
              <span style={{ fontFamily: 'var(--font-heading)' }}>Trek with Ashim</span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {tagline}
            </p>

            {/* Social links — from admin settings */}
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(s => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full text-white text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.label}
                  </a>
                ))}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full text-white text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            ) : (
              // Show placeholder text if admin hasn't added links yet
              <p className="text-gray-600 text-xs">
                Social links coming soon
              </p>
            )}
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'All Treks',     path: '/treks' },
                { name: 'Photo Gallery', path: '/gallery' },
                { name: 'Trek Stories',  path: '/blog' },
                { name: 'About Ashim',   path: '/about' },
                { name: 'Contact',       path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Popular Treks */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Popular Treks
            </h4>
            <ul className="space-y-3">
              {[
                'Everest Base Camp',
                'Annapurna Circuit',
                'Langtang Valley',
                'Manaslu Circuit',
                'Upper Mustang',
              ].map(name => (
                <li key={name}>
                  <Link
                    to="/treks"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact Info from settings */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-4">

              {address && (
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">{address}</span>
                </li>
              )}

              {phone && (
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  {/* Make phone a clickable tel link */}
                  <a
                    href={'tel:' + phone.replace(/\s/g, '')}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              )}

              {email && (
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  {/* Make email a clickable mailto link */}
                  <a
                    href={'mailto:' + email}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {email}
                  </a>
                </li>
              )}

              {/* WhatsApp quick contact */}
              {whatsappUrl && (
                <li className="mt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    💬 Chat on WhatsApp
                  </a>
                </li>
              )}

            </ul>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Trek with Ashim. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Built with ❤️ for the mountains of Nepal
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer