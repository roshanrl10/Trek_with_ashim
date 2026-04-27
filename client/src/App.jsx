import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'

// We'll add more pages here one by one
// For now just the homepage to confirm everything works

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* More routes coming in next lessons */}
      </Routes>
    </Layout>
  )
}

export default App