import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { getAllTreksAdmin, deleteTrek } from '../../api/treks'
import Spinner from '../../components/common/Spinner'

const AdminTreks = () => {
  const queryClient = useQueryClient()

  const { data: treks, isLoading } = useQuery({
    queryKey: ['admin-treks'],
    queryFn:  getAllTreksAdmin,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTrek,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-treks'])
      toast.success('Trek deleted')
    },
    onError: () => toast.error('Failed to delete trek'),
  })

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id)
    }
  }

  // Style helpers — defined outside JSX to avoid > parsing issues
  const publishedStyle = { backgroundColor: '#dcfce7', color: '#166534' }
  const draftStyle     = { backgroundColor: '#fef9c3', color: '#854d0e' }

  if (isLoading) return <Spinner />

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Manage Treks
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {treks?.length || 0} treks total
          </p>
        </div>
        <Link to="/admin/treks/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add New Trek
        </Link>
      </div>

      {/* Treks Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {!treks || treks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🏔️</p>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No treks yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Add your first trek to get started</p>
            <Link to="/admin/treks/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              Add First Trek
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  {['Trek', 'Region', 'Duration', 'Difficulty', 'Price', 'Status', 'Actions'].map(h => (
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
                {treks.map(trek => (
                  <tr key={trek._id} className="hover:bg-gray-50 transition-colors">

                    {/* Trek name + thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-green-50 flex items-center justify-center text-lg">
                          {trek.coverImage?.url ? (
                            <img
                              src={trek.coverImage.url}
                              alt={trek.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            '🏔️'
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{trek.title}</p>
                          <p className="text-xs text-gray-400">/{trek.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trek.region}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trek.duration}d
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trek.difficulty}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trek.price ? '$' + trek.price : 'N/A'}
                    </td>

                    {/* Published / Draft badge */}
                    <td className="px-6 py-4">
                      <span
                        className="badge text-xs font-medium"
                        style={trek.isPublished ? publishedStyle : draftStyle}
                      >
                        {trek.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">

                        {/* View on public site */}
                        <a
                          href={'/treks/' + trek.slug}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on site"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={15} />
                        </a>

                        {/* Edit */}
                        <Link
                          to={'/admin/treks/edit/' + trek._id}
                          title="Edit"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(trek._id, trek.title)}
                          disabled={deleteMutation.isPending}
                          title="Delete"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default AdminTreks