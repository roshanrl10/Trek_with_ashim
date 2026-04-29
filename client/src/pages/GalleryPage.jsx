import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getGallery } from '../api/gallery'
import Spinner from '../components/common/Spinner'

const GalleryPage = () => {
  const [mediaType, setMediaType] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', mediaType, page],
    queryFn:  () => getGallery({ mediaType, page, limit: 18 }),
  })

  const filters = [
    { label: 'All',    value: '' },
    { label: 'Photos', value: 'photo' },
    { label: 'Videos', value: 'video' },
  ]

  return (
    <div className="bg-white min-h-screen">

      {/* Page Header */}
      <div
        className="py-20 text-white text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
            url('https://images.unsplash.com/photo-1585016495481-91613e9f1e55?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1
          className="text-5xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Gallery
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Memories from the mountains — every photo tells a story
        </p>
      </div>

      <div className="container-custom py-12">

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-10">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => { setMediaType(f.value); setPage(1) }}
              className="px-6 py-2 rounded-full text-sm font-semibold border transition-all"
              style={
                mediaType === f.value
                  ? { backgroundColor: 'var(--color-forest-700)', color: 'white', borderColor: 'var(--color-forest-700)' }
                  : { backgroundColor: 'white', color: '#374151', borderColor: '#d1d5db' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <Spinner />
        ) : !data?.items?.length ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📷</p>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No photos yet</h3>
            <p className="text-gray-400 text-sm">Check back after Ashim's next trek!</p>
          </div>
        ) : (
          <>
            {/* Masonry-style grid using CSS columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {data.items.map(item => (
                <div
                  key={item._id}
                  className="break-inside-avoid rounded-xl overflow-hidden group relative"
                >
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.url}
                      className="w-full rounded-xl"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption || 'Trek photo'}
                      className="w-full rounded-xl transition-transform duration-300 group-hover:scale-105"
                      style={{ display: 'block' }}
                    />
                  )}

                  {/* Caption overlay on hover */}
                  {(item.caption || item.location) && (
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                      style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
                    >
                      {item.caption && (
                        <p className="text-white text-sm font-medium">{item.caption}</p>
                      )}
                      {item.location && (
                        <p className="text-gray-300 text-xs mt-1">📍 {item.location}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="px-5 py-2 rounded-lg text-sm font-medium border disabled:opacity-40"
                  style={{ borderColor: '#d1d5db' }}
                >
                  Previous
                </button>
                <span className="px-5 py-2 text-sm text-gray-600">
                  Page {page} of {data.pages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === data.pages}
                  className="px-5 py-2 rounded-lg text-sm font-medium border disabled:opacity-40"
                  style={{ borderColor: '#d1d5db' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default GalleryPage