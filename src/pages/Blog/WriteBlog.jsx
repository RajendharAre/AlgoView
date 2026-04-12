import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import { submitBlog } from '../../services/blogsService'
import { trackEvent } from '../../lib/analytics'
import usePageMeta from '../../hooks/usePageMeta'

const WriteBlog = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector(state => state.user)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'DSA',
    tags: '',
    keywords: '',
    relatedVisualizer: '',
  })
  const [errors, setErrors] = useState({})

  // Set page metadata
  usePageMeta({
    title: 'Write a Blog Post - AlgoView',
    description:
      'Share your knowledge with the AlgoView community. Write blog posts about algorithms, DSA, and web development.',
  })

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login')
      return
    }

    // Debug: log user info
    console.log('📝 WriteBlog - Current user:', {
      uid: currentUser.uid,
      email: currentUser.email,
      isPremium: currentUser.isPremium,
    })

    // For now, allow any authenticated user to write blogs
    // In production, you can add subscription checks here
    trackEvent('blog_write_page_loaded', {
      userEmail: currentUser.email,
    })
  }, [currentUser, navigate])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    else if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters'

    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    else if (formData.excerpt.length < 20)
      newErrors.excerpt = 'Excerpt must be at least 20 characters'

    if (!formData.content.trim()) newErrors.content = 'Content is required'
    else if (formData.content.length < 100)
      newErrors.content = 'Content must be at least 100 characters'

    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.tags.trim()) newErrors.tags = 'At least one tag is required'
    if (!formData.keywords.trim()) newErrors.keywords = 'SEO keywords are required'

    return newErrors
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Debug log
      console.log('📝 Attempting to submit blog with:', {
        userId: currentUser?.uid,
        email: currentUser?.email,
        userObject: currentUser,
      })

      // Check if user has uid
      if (!currentUser?.uid) {
        throw new Error('User ID not found. Please refresh and log in again.')
      }

      // Submit to Firebase
      const result = await submitBlog(formData, currentUser.uid, currentUser.email)

      console.log('📝 Blog submission result:', result)

      if (result.success) {
        trackEvent('blog_post_submitted', {
          title: formData.title,
          category: formData.category,
          contentLength: formData.content.length,
        })

        setSubmitted(true)
        setTimeout(() => {
          navigate('/blog')
        }, 2000)
      } else {
        setErrors({ submit: result.error || 'Failed to submit blog' })
      }
    } catch (error) {
      console.error('Error submitting blog:', error)
      setErrors({ submit: error.message || 'An error occurred while submitting your blog' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Post Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your blog post has been submitted for review. Our team will verify it and publish once
            approved.
          </p>
          <p className="text-sm text-gray-500">Redirecting to blog...</p>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold">Write a Blog Post</h1>
          <p className="text-blue-100 mt-2">Share your knowledge with the AlgoView community</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Submit Error */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Bubble Sort Explained: Step-by-Step Animation & Code"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/100 characters. Make it descriptive and SEO-friendly.
              </p>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of your post (appears in blog list)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="3"
              />
              {errors.excerpt && <p className="text-red-600 text-sm mt-1">{errors.excerpt}</p>}
              <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Content * (Markdown supported)
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog post here. Use markdown for formatting:
## Heading 2
### Heading 3
**bold text**
- bullet points
\`\`\`code\`\`\`
[link](url)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-vertical font-mono text-sm ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="12"
              />
              {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.length} characters. Minimum 100 required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="DSA">DSA & Algorithms</option>
                  <option value="Web Development">Web Development</option>
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tags * (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., sorting, algorithms, beginner"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.tags ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.tags && <p className="text-red-600 text-sm mt-1">{errors.tags}</p>}
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                SEO Keywords * (comma-separated)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="e.g., bubble sort, sorting algorithm, algorithm visualization, DSA"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.keywords ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.keywords && <p className="text-red-600 text-sm mt-1">{errors.keywords}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Help readers find your post through search engines
              </p>
            </div>

            {/* Related Visualizer */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Related Visualizer Path (optional)
              </label>
              <input
                type="text"
                name="relatedVisualizer"
                value={formData.relatedVisualizer}
                onChange={handleInputChange}
                placeholder="e.g., /dsa/algorithms/sorting"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-sm text-gray-500 mt-1">
                Readers will be directed to this page for interactive practice
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">Before Publishing</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Your post will be reviewed by our team (typically within 24 hours)</li>
                <li>✓ Focus on quality content with practical examples</li>
                <li>✓ Include links to related visualizer pages for more engagement</li>
                <li>✓ Use clear formatting and code examples for readability</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WriteBlog
