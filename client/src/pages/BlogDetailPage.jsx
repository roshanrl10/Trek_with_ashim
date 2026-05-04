import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock, ArrowLeft, Tag } from 'lucide-react'
import { getPostBySlug } from '../api/posts'
import Spinner from '../components/common/Spinner'

const BlogDetailPage = () => {
  const { slug } = useParams()

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn:  () => getPostBySlug(slug),
  })

  if (isLoading) return <Spinner />

  if (isError || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📝</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Post not found</h2>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div
        className="relative h-72 md:h-96 flex items-end"
        style={{
          backgroundImage: post.coverImage?.url
            ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%), url(' + post.coverImage.url + ')'
            : 'linear-gradient(135deg, #166534, #15803d)',
          backgroundSize: 'cover',
          backgroundPosition: post.coverImage?.position || 'center center',
        }}
      >
        <Link to="/blog"
          className="absolute top-6 left-6 flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={16} />
          Blog
        </Link>
        <div className="container-custom pb-8 text-white w-full">
          <span className="badge text-xs font-semibold mb-3 inline-block"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="border-b border-gray-100 py-4">
        <div className="container-custom flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {post.readTime && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime} min read
            </span>
          )}
          <span>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
          {post.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} />
              {post.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: '#f0fdf4', color: 'var(--color-forest-700)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">

          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 pl-5"
              style={{ borderColor: 'var(--color-forest-500)' }}>
              {post.excerpt}
            </p>
          )}

          {/* Render content — split by double newlines into paragraphs */}
          <div className="prose max-w-none">
            {post.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-5 text-lg">
                {para}
              </p>
            ))}
          </div>

          {/* Related Trek */}
          {post.relatedTrek && (
            <div className="mt-12 p-6 rounded-2xl" style={{ backgroundColor: '#f0fdf4' }}>
              <p className="text-sm font-semibold text-gray-500 mb-2">Related Trek</p>
              <Link to={'/treks/' + post.relatedTrek.slug}
                className="text-xl font-bold hover:underline"
                style={{ color: 'var(--color-forest-700)' }}>
                {post.relatedTrek.title} →
              </Link>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default BlogDetailPage