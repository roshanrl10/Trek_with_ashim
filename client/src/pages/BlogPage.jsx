import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import { getPosts } from '../api/posts'
import Spinner from '../components/common/Spinner'

const BlogPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn:  () => getPosts({ limit: 9 }),
  })

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div
        className="py-20 text-white text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
            url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1
          className="text-5xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Trek Stories
        </h1>
        <p className="text-gray-300 text-lg">
          Tales from the trail — tips, culture, and mountain life
        </p>
      </div>

      <div className="container-custom py-16">
        {isLoading ? (
          <Spinner />
        ) : !data?.posts?.length ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">✍️</p>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-400 text-sm">Stories from the trail coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.posts.map(post => (
              <div key={post._id} className="card group">
                {/* Cover image */}
                <div className="h-52 overflow-hidden">
                  {post.coverImage?.url ? (
                    <img
                      src={post.coverImage.url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ objectPosition: post.coverImage.position || 'center center' }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ backgroundColor: '#f0fdf4' }}
                    >
                      📝
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Category badge */}
                  <span
                    className="badge text-xs font-semibold mb-3 inline-block"
                    style={{ backgroundColor: '#f0fdf4', color: 'var(--color-forest-700)' }}
                  >
                    {post.category}
                  </span>

                  <h3
                    className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-green-700 transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {post.readTime && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        {post.readTime} min read
                      </span>
                    )}
                    <Link
                      to={'/blog/' + post.slug}
                      className="flex items-center gap-1 text-sm font-semibold"
                      style={{ color: 'var(--color-forest-700)' }}
                    >
                      Read more
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage