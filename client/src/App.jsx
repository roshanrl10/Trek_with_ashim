import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

// Public pages
import HomePage       from './pages/HomePage'
import TreksPage      from './pages/TreksPage'
import TrekDetailPage from './pages/TrekDetailPage'
import GalleryPage    from './pages/GalleryPage'
import BlogPage       from './pages/BlogPage'
import AboutPage      from './pages/AboutPage'
import ContactPage    from './pages/ContactPage'
import LoginPage      from './pages/LoginPage'
import NotFoundPage   from './pages/NotFoundPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTreks     from './pages/admin/AdminTreks'
import AdminAddTrek   from './pages/admin/AdminAddTrek'

function App() {
  return (
    <Routes>

      {/* PUBLIC PAGES */}
      <Route path="/"            element={<Layout><HomePage /></Layout>} />
      <Route path="/treks"       element={<Layout><TreksPage /></Layout>} />
      <Route path="/treks/:slug" element={<Layout><TrekDetailPage /></Layout>} />
      <Route path="/gallery"     element={<Layout><GalleryPage /></Layout>} />
      <Route path="/blog"        element={<Layout><BlogPage /></Layout>} />
      <Route path="/about"       element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact"     element={<Layout><ContactPage /></Layout>} />
      <Route path="/login"       element={<LoginPage />} />

      {/* ADMIN PAGES */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/treks" element={
        <ProtectedRoute>
          <AdminLayout><AdminTreks /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/treks/new" element={
        <ProtectedRoute>
          <AdminLayout><AdminAddTrek /></AdminLayout>
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />

    </Routes>
  )
}

export default App