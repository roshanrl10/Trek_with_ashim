import { Link } from 'react-router-dom'
import { Mountain, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="text-white" style={{ backgroundColor: '#1a2e1a' }}>

      {/* ── MAIN FOOTER CONTENT ── */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <Mountain size={28} style={{ color: 'var(--color-forest-500)' }} />
              <span style={{ fontFamily: 'var(--font-heading)' }}>Trek with Ashim</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted trekking guide in Nepal. Explore the Himalayas safely
              with years of local expertise and genuine mountain passion.
            </p>

            {/* Social Icons — using text instead of icons to avoid version issues */}
            <div className="flex gap-3">
              {[
                { label: 'Instagram', href: '#', bg: '#E1306C' },
                { label: 'Facebook',  href: '#', bg: '#1877F2' },
                { label: 'YouTube',   href: '#', bg: '#FF0000' },
              ].map(({ label, href, bg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="px-3 py-1 rounded-full text-white text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: bg }}
                >
                  {label}
                </a>
              ))}
            </div>
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

          {/* Column 4 — Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: 'Thamel, Kathmandu, Nepal' },
                { icon: Phone,  text: '+977 98XXXXXXXX' },
                { icon: Mail,   text: 'ashim@trekwithashim.com' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">{text}</span>
                </li>
              ))}
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