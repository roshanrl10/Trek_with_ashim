import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import api from '../api/axios'
import Spinner from '../components/common/Spinner'

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await api.post('/contact', data)
      toast.success("Message sent! Ashim will reply soon 🏔️")
      reset() // clear the form after success
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Location',
      value: 'Thamel, Kathmandu, Nepal',
    },
    {
      icon: Phone,
      label: 'WhatsApp / Phone',
      value: '+977 98XXXXXXXX',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'ashim@trekwithashim.com',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
    },
  ]

  // Input style helper
  const inputStyle = (hasError) => ({
    borderColor: hasError ? '#ef4444' : '#e5e7eb',
    outline: 'none',
  })

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div
        className="py-20 text-white text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
            url('https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1
          className="text-5xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Get in Touch
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Have a question about a trek? Want to book? Ashim personally
          replies to every message.
        </p>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── LEFT: Contact Info ── */}
          <div className="space-y-6">
            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Contact Details
              </h2>
              <p className="text-gray-500 text-sm">
                Reach out any time — Ashim is usually on trail or in Kathmandu
              </p>
            </div>

            {contactInfo.map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#f0fdf4' }}
                >
                  <item.icon size={20} style={{ color: 'var(--color-forest-700)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-gray-800 font-medium mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Best time to trek */}
            <div
              className="rounded-2xl p-5 mt-4"
              style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}
            >
              <h3 className="font-bold text-gray-900 mb-2 text-sm">Best Trekking Seasons</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>🍂 <strong>Autumn:</strong> Oct — Nov (best visibility)</p>
                <p>🌸 <strong>Spring:</strong> Mar — May (rhododendrons)</p>
                <p>❄️ <strong>Winter:</strong> Dec — Feb (quiet trails)</p>
                <p>🌧️ <strong>Monsoon:</strong> Jun — Sep (lush but wet)</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Contact Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2
                className="text-2xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Send a Message
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border text-sm"
                      style={inputStyle(errors.name)}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border text-sm"
                      style={inputStyle(errors.email)}
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={inputStyle(false)}
                    {...register('phone')}
                  />
                </div>

                {/* Trek interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trek of Interest
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border text-sm bg-white"
                    style={inputStyle(false)}
                    {...register('trekInterest')}
                  >
                    <option value="">Select a trek (optional)</option>
                    <option>Everest Base Camp</option>
                    <option>Annapurna Circuit</option>
                    <option>Langtang Valley</option>
                    <option>Manaslu Circuit</option>
                    <option>Upper Mustang</option>
                    <option>Custom / Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell Ashim about your dream trek — dates, group size, experience level..."
                    className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
                    style={inputStyle(errors.message)}
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="small" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ContactPage