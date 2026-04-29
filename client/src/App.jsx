import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import TreksPage from './pages/TreksPage'
import TrekDetailPage from './pages/TrekDetailPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/treks"       element={<TreksPage />} />
        <Route path="/treks/:slug" element={<TrekDetailPage />} />
        {/* More routes coming soon */}
      </Routes>
    </Layout>
  )
}

export default App