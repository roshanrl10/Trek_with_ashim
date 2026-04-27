import { createContext, useContext, useState, useEffect } from 'react'

// 1. Create the context — think of it as an empty container
const AuthContext = createContext(null)

// 2. Create the Provider — this wraps the whole app and provides the data
export const AuthProvider = ({ children }) => {
  // Check localStorage on startup — if user was logged in before, restore them
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })

  // login: save user to state AND localStorage
  // localStorage persists between page refreshes
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // logout: clear everything
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  // Convenience checks
  const isLoggedIn = !!user        // true if user exists
  const isAdmin    = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — makes using the context clean and simple
// Instead of: const { user } = useContext(AuthContext)
// We write:   const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}