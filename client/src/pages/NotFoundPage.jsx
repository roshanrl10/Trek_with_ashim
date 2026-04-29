import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center px-4">
      <p className="text-8xl mb-6">🏔️</p>
      <h1
        className="text-6xl font-bold text-gray-900 mb-4"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">
        Lost on the trail?
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        This page doesn't exist. Even the best guides take a wrong turn sometimes.
      </p>
      <Link to="/" className="btn-primary inline-block">
        Back to Base Camp
      </Link>
    </div>
  </div>
)

export default NotFoundPage