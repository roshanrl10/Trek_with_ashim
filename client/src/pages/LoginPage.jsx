import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mountain, Eye, EyeOff } from 'lucide-react'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]       = useState(false)

  // useNavigate lets us redirect the user programmatically
  const navigate  = useNavigate()

  // login function from our AuthContext (saves user to state + localStorage)
  const { login: saveUser } = useAuth()

  // react-hook-form manages the form — handles values, validation, errors
  // register — connects an input to the form
  // handleSubmit — runs our function only if validation passes
  // formState.errors — contains any validation errors
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    // data contains { email, password } from the form
    setIsLoading(true)
    try {
      // Call our backend login API
      const user = await login(data)

      // Save user to context + localStorage
      saveUser(user)

      // Show success notification
      toast.success(`Welcome back, ${user.name}! 🏔️`)

      // Redirect to admin dashboard
      navigate('/admin')

    } catch (error) {
      // Show error notification
      // error.response.data.message is the message our backend sends back
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
          url('https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#f0fdf4' }}
            >
              <Mountain size={32} style={{ color: 'var(--color-forest-700)' }} />
            </div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Admin Login
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Trek with Ashim — Dashboard
            </p>
          </div>

          {/* Form */}
          {/* handleSubmit wraps our onSubmit — validates first, then calls onSubmit */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="ashim@trekwithashim.com"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: errors.email ? '#ef4444' : '#d1d5db' }}
                // register connects this input to react-hook-form
                // 'email' is the field name
                // { required: '...' } is the validation rule
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address'
                  }
                })}
              />
              {/* Show error message if validation fails */}
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  // Toggle between 'password' (hidden) and 'text' (visible)
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-12"
                  style={{ borderColor: errors.password ? '#ef4444' : '#d1d5db' }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {/* Eye icon to toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner size="small" />
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>

          </form>

          {/* Back to site link */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to website
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage