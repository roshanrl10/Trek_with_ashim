import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Mountain, LayoutDashboard, Map, Images, FileText,
  LogOut, Menu, X, ExternalLink, Mail, Settings, User
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard',      path: '/admin' },
    { icon: Map,             label: 'Treks',          path: '/admin/treks' },
    { icon: Images,          label: 'Gallery',        path: '/admin/gallery' },
    { icon: FileText,        label: 'Blog Posts',     path: '/admin/posts' },
    { icon: Mail,            label: 'Messages',       path: '/admin/messages' },
    { icon: Settings,        label: 'Site Settings',  path: '/admin/settings' },
    { icon: User,            label: 'About Page',     path: '/admin/about' },
  ]

  // Styles defined outside JSX to avoid parsing issues
  const sidebarStyle = { backgroundColor: '#1a2e1a' }
  const borderStyle  = { borderColor: 'rgba(255,255,255,0.1)' }
  const borderStyle2 = { borderColor: 'rgba(255,255,255,0.08)' }
  const activeNavStyle   = { backgroundColor: 'var(--color-forest-700)' }
  const inactiveNavStyle = {}

  // Sidebar translate class based on open state
  const sidebarClass = [
    'fixed inset-y-0 left-0 z-50 w-64 text-white flex flex-col',
    'transform transition-transform duration-200 ease-in-out',
    'md:relative md:translate-x-0',
    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
  ].join(' ')

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <aside className={sidebarClass} style={sidebarStyle}>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b" style={borderStyle}>
          <Link to="/" className="flex items-center gap-2">
            <Mountain size={24} style={{ color: '#86efac' }} />
            <div>
              <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                Trek with Ashim
              </p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b" style={borderStyle2}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
            style={{ backgroundColor: 'var(--color-forest-700)' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm font-semibold text-white">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ' +
                (isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')
              }
              style={({ isActive }) => isActive ? activeNavStyle : inactiveNavStyle}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 space-y-1 border-t" style={borderStyle2}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={18} />
            View Public Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.name} 👋
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  )
}

export default AdminLayout