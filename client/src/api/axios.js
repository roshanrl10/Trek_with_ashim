import axios from 'axios'

// Create a custom axios instance with our backend URL as the base
// Instead of writing http://localhost:5000/api/treks every time,
// we just write /treks and axios prepends the base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR
// This runs automatically before EVERY request we make
// It checks if the user is logged in and adds their token to the request
api.interceptors.request.use(
  (config) => {
    // Get the user data from localStorage (we'll store it there after login)
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    // If user is logged in, add their token to the Authorization header
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR
// This runs after EVERY response comes back
// If we get a 401 (unauthorized), the token has expired — log the user out
api.interceptors.response.use(
  (response) => response, // success — just pass it through
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local storage and redirect to login
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api