import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, Share2, Tag, MessageSquare, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getBlogBySlug, incrementBlogViews } from '../../services/blogsService'
import { trackEvent } from '../../lib/analytics'
import usePageMeta from '../../hooks/usePageMeta'
import Loader from '../../components/Common/Loader'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true)
      const foundBlog = await getBlogBySlug(slug)

      if (!foundBlog) {
        navigate('/blog')
        return
      }

      setBlog(foundBlog)

      // Increment views
      if (foundBlog.id) {
        await incrementBlogViews(foundBlog.id)
      }

      // Track blog view
      trackEvent('blog_post_viewed', {
        slug: foundBlog.slug,
        title: foundBlog.title,
        category: foundBlog.category,
      })

      // Load comments from localStorage (mock - in production, use Firebase subcollection)
      const savedComments = localStorage.getItem(`blog-comments-${slug}`)
      if (savedComments) {
        setComments(JSON.parse(savedComments))
      }

      setLoading(false)
    }

    fetchBlog()
  }, [slug, navigate])

  // Set page metadata for SEO
  usePageMeta(
    blog
      ? {
          title: `${blog.title} - AlgoView Blog`,
          description: blog.excerpt,
          keywords: blog.keywords,
          ogImage: '/og-blog.png',
        }
      : {}
  )

  if (loading) {
    return <Loader />
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400">Blog not found</div>
        </div>
      </div>
    )
  }

  const handleShare = platform => {
    const url = window.location.href
    const title = blog.title

    trackEvent('blog_post_shared', {
      slug: blog.slug,
      platform: platform,
    })

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent('blog_post_link_copied', { slug: blog.slug })
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return

    const newComment = {
      id: Date.now(),
      author: 'You',
      date: new Date().toLocaleDateString(),
      text: commentText,
    }

    const updatedComments = [...comments, newComment]
    setComments(updatedComments)
    localStorage.setItem(`blog-comments-${slug}`, JSON.stringify(updatedComments))
    setCommentText('')

    trackEvent('blog_comment_added', {
      slug: blog.slug,
      commentLength: commentText.length,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
          <p className="text-blue-100 text-lg">{blog.excerpt}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{blog.authorEmail}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(blog.createdAt?.toDate?.() || blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {blog.readTime}
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {blog.category}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Content */}
            <div className="bg-white p-8 rounded-lg shadow markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b-2 border-blue-500 pb-2"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-700" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside mb-4 space-y-2 text-gray-700 ml-4"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 italic text-gray-700"
                      {...props}
                    />
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : 'javascript'

                    if (inline) {
                      return (
                        <code
                          className="bg-gray-100 text-red-600 px-2 py-1 rounded font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    }

                    return (
                      <SyntaxHighlighter
                        language={language}
                        style={oneDark}
                        className="rounded-lg my-4 overflow-x-auto"
                        showLineNumbers
                        wrapLines
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    )
                  },
                  pre: ({ node, ...props }) => <pre className="mb-4" {...props} />,
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table
                        className="min-w-full border-collapse border border-gray-300"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gray-800 text-white" {...props} />
                  ),
                  tbody: ({ node, ...props }) => <tbody {...props} />,
                  tr: ({ node, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
                  th: ({ node, ...props }) => (
                    <th
                      className="px-4 py-3 border border-gray-300 font-bold text-left"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-4 py-2 border border-gray-300 text-gray-700" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="max-w-full rounded-lg my-4" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-gray-900" {...props} />
                  ),
                  em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                  hr: ({ node, ...props }) => (
                    <hr className="my-6 border-t-2 border-gray-300" {...props} />
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Call to Action */}
            {blog.relatedVisualizer && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-12">
                <h3 className="text-2xl font-bold mb-2">Ready to Practice?</h3>
                <p className="text-blue-100 mb-4">
                  Try the interactive visualizer to see these concepts in action with real-time
                  animations.
                </p>
                <button
                  onClick={() => {
                    trackEvent('blog_cta_clicked', {
                      slug: blog.slug,
                      destination: blog.relatedVisualizer,
                    })
                    navigate(blog.relatedVisualizer)
                  }}
                  className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Go to Visualizer
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Share Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share This Post
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Facebook
                </button>
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {copied ? '✓ Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this post..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows="4"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Display Comments */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{comment.author}</p>
                          <p className="text-sm text-gray-500">{comment.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags &&
                  blog.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => navigate(`/blog?tag=${tag}`)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>

            {/* Blog Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Post Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold text-gray-900">{blog.views || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Read Time</span>
                  <span className="font-semibold text-gray-900">{blog.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
