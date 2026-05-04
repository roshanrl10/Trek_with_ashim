import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Map, Images, FileText, Plus, ArrowRight } from 'lucide-react'
import { getAllTreksAdmin } from '../../api/treks'
import Spinner from '../../components/common/Spinner'
import { Settings, Mail, User } from 'lucide-react'

const AdminDashboard = () => {
  // Fetch all treks (including drafts) for the stat count
  const { data: treks, isLoading } = useQuery({
    queryKey: ['admin-treks'],
    queryFn:  getAllTreksAdmin,
  })

  const published = treks?.filter(t => t.isPublished).length  || 0
  const drafts    = treks?.filter(t => !t.isPublished).length || 0

  // Quick action cards
  const stats = [
    {
      icon:  Map,
      label: 'Total Treks',
      value: treks?.length || 0,
      color: '#166534',
      bg:    '#f0fdf4',
      link:  '/admin/treks',
    },
    {
      icon:  Map,
      label: 'Published',
      value: published,
      color: '#0369a1',
      bg:    '#f0f9ff',
      link:  '/admin/treks',
    },
    {
      icon:  Map,
      label: 'Drafts',
      value: drafts,
      color: '#b45309',
      bg:    '#fffbeb',
      link:  '/admin/treks',
    },
  ]

 const quickActions = [
    
  { icon: Map,      label: 'Add New Trek',    desc: 'Create a new trek',         link: '/admin/treks/new',  color: '#166534', bg: '#f0fdf4' },
  { icon: Images,   label: 'Upload Photos',   desc: 'Add to the gallery',        link: '/admin/gallery',    color: '#0369a1', bg: '#f0f9ff' },
  { icon: FileText, label: 'Write a Post',    desc: 'Share a trek story',        link: '/admin/posts/new',  color: '#7c3aed', bg: '#faf5ff' },
  { icon: Settings, label: 'Site Settings',   desc: 'Edit homepage content',     link: '/admin/settings',   color: '#b45309', bg: '#fffbeb' },
  { icon: Mail,     label: 'View Messages',   desc: 'Check contact inquiries',   link: '/admin/messages',   color: '#0f766e', bg: '#f0fdfa' },
  { icon: User,     label: 'Edit About Page', desc: 'Update your profile',       link: '/admin/about',      color: '#be185d', bg: '#fdf2f8' },
  
  ]

  if (isLoading) return <Spinner />

  return (
    <div className="space-y-8">

      {/* Page Title */}
      <div>
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your treks, gallery and blog posts
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map(stat => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map(action => (
            <Link
              key={action.label}
              to={action.link}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: action.bg }}
              >
                <action.icon size={22} style={{ color: action.color }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                {action.label}
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: action.color }}
                />
              </h3>
              <p className="text-gray-500 text-sm">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Treks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Treks</h2>
          <Link
            to="/admin/treks"
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: 'var(--color-forest-700)' }}
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {treks?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No treks yet</p>
              <Link to="/admin/treks/new" className="btn-primary inline-flex items-center gap-2">
                <Plus size={16} />
                Add Your First Trek
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  {['Trek', 'Region', 'Difficulty', 'Status', ''].map(h => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {treks?.slice(0, 5).map(trek => (
                  <tr key={trek._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{trek.title}</p>
                      <p className="text-xs text-gray-400">{trek.duration} days</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{trek.region}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600">
                        {trek.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="badge text-xs font-medium"
                        style={
                          trek.isPublished
                            ? { backgroundColor: '#dcfce7', color: '#166534' }
                            : { backgroundColor: '#fef9c3', color: '#854d0e' }
                        }
                      >
                        {trek.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/treks/edit/${trek._id}`}
                        className="text-xs font-medium"
                        style={{ color: 'var(--color-forest-700)' }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard