import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Mountain, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  // Controls whether the mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false)

  // Get user info and logout function from our global auth context
  const { user, isAdmin, logout } = useAuth()

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  // Navigation links — defined as an array so we can render them
  // in both the desktop menu and mobile menu without repeating code
  const navLinks = [
    { name: 'Home',    path: '/' },
    { name: 'Treks',   path: '/treks' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog',    path: '/blog' },
    { name: 'About',   path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    // sticky top-0 — stays at top when you scroll
    // z-50 — sits above all other elements
    // backdrop-blur — frosted glass effect
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* ── LOGO ── */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold"
            style={{ color: 'var(--color-forest-800)', fontFamily: 'var(--font-heading)' }}
          >
            <Mountain size={28} style={{ color: 'var(--color-forest-600)' }} />
            <span>Trek with Ashim</span>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          {/* hidden on mobile, flex on medium screens and up */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                // NavLink automatically adds the "active" class when the URL matches
                // We use this to highlight the current page
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { backgroundColor: 'var(--color-forest-700)' } : {}
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* ── DESKTOP RIGHT SIDE ── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // If logged in — show admin link and logout button
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg"
                    style={{ color: 'var(--color-forest-700)' }}
                  >
                    <LayoutDashboard size={16} />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              // If not logged in — show login button
              <Link to="/login" className="btn-primary text-sm py-2 px-5">
                Login
              </Link>
            )}
          </div>

          {/* ── MOBILE HAMBURGER BUTTON ── */}
          {/* Only shows on small screens */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {/* Show X when menu is open, hamburger when closed */}
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {/* Only visible when isOpen is true */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // close menu when link is clicked
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: 'var(--color-forest-700)' } : {}
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile login/admin/logout */}
          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg"
                    style={{ color: 'var(--color-forest-700)' }}
                  >
                    <LayoutDashboard size={16} />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block btn-primary text-center text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar