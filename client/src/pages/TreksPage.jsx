import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, X } from 'lucide-react'
import { getTreks } from '../api/treks'
import TrekCard from '../components/trek/TrekCard'
import Spinner from '../components/common/Spinner'

// Filter options
const REGIONS = ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Kanchenjunga', 'Dolpo', 'Other']
const DIFFICULTIES = ['Easy', 'Moderate', 'Strenuous', 'Extreme']

const TreksPage = () => {
  // Filter state — starts with no filters (show all)
  const [filters, setFilters] = useState({ region: '', difficulty: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  // useQuery fetches data from our backend
  // 'treks' is the cache key — React Query uses this to store and reuse the data
  // Every time filters or page changes, it automatically refetches
  const { data, isLoading, isError } = useQuery({
    queryKey: ['treks', filters, page],
    queryFn:  () => getTreks({ ...filters, page, limit: 9 }),
  })

  const handleFilterChange = (key, value) => {
    // If same value clicked again — clear that filter
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }))
    setPage(1) // reset to page 1 when filter changes
  }

  const clearFilters = () => {
    setFilters({ region: '', difficulty: '' })
    setPage(1)
  }

  const hasActiveFilters = filters.region || filters.difficulty

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── PAGE HEADER ── */}
      <div
        className="py-20 text-white text-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
            url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1
          className="text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          All Treks
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Every route personally guided by Ashim through Nepal's most
          spectacular mountain landscapes
        </p>
      </div>

      <div className="container-custom py-12">

        {/* ── FILTER BAR ── */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8">

          {/* Filter header row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                // Red dot showing active filters
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#ef4444' }}
                />
              )}
            </button>

            {/* Show result count */}
            <span className="text-sm text-gray-500">
              {data?.total || 0} treks found
            </span>

            {/* Clear filters button — only shows when filters are active */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>

          {/* Filter options — shown/hidden by toggle */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-100">

              {/* Region filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Region
                </p>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      onClick={() => handleFilterChange('region', region)}
                      className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                      style={
                        filters.region === region
                          ? { backgroundColor: 'var(--color-forest-700)', color: 'white', borderColor: 'var(--color-forest-700)' }
                          : { backgroundColor: 'white', color: '#374151', borderColor: '#d1d5db' }
                      }
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Difficulty
                </p>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(diff => (
                    <button
                      key={diff}
                      onClick={() => handleFilterChange('difficulty', diff)}
                      className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                      style={
                        filters.difficulty === diff
                          ? { backgroundColor: 'var(--color-forest-700)', color: 'white', borderColor: 'var(--color-forest-700)' }
                          : { backgroundColor: 'white', color: '#374151', borderColor: '#d1d5db' }
                      }
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── TREK CARDS GRID ── */}
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          // Error state
          <div className="text-center py-20">
            <p className="text-4xl mb-4">😕</p>
            <p className="text-gray-500">Could not load treks. Please try again.</p>
          </div>
        ) : data?.treks?.length === 0 ? (
          // Empty state — no treks match the filters
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏔️</p>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No treks found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Trek cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.treks.map(trek => (
                <TrekCard key={trek._id} trek={trek} />
              ))}
            </div>

            {/* ── PAGINATION ── */}
            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {/* Previous button */}
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: '#d1d5db' }}
                >
                  ← Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: data.pages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                    style={
                      page === num
                        ? { backgroundColor: 'var(--color-forest-700)', color: 'white' }
                        : { backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }
                    }
                  >
                    {num}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === data.pages}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: '#d1d5db' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default TreksPage