import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// This component wraps any page that requires login
// If the user is not an admin, they get redirected to /login
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth()

  // Not logged in at all — send to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Logged in but not admin — send back to homepage
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  // All good — show the protected page
  return children
}

export default ProtectedRoute