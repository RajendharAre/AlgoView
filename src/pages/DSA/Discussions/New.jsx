import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Tag, User } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { db } from '../../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const DSADiscussionNew = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to post a discussion')
      return
    }
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Parse tags from comma-separated string
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      // Create discussion document
      const discussionRef = doc(db, 'discussions', Date.now().toString())
      
      await setDoc(discussionRef, {
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray,
        authorId: user.uid,
        authorName: user.email?.split('@')[0] || 'Anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        replies: 0,
        views: 0,
        lastActivity: serverTimestamp()
      })
      
      // Navigate to the discussions list
      navigate('/dsa/discussions')
    } catch (err) {
      console.error('Error creating discussion:', err)
      setError('Failed to create discussion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Start a New Discussion</h1>
            <p className="text-gray-600 mt-1">Share your thoughts and questions with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discussion Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a clear and descriptive title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add tags separated by commas (e.g., algorithms, data-structures, sorting)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tags help others find your discussion. Use relevant keywords.
              </p>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    loading 
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Post Discussion
                    </>)}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/dsa/discussions')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default DSADiscussionNew