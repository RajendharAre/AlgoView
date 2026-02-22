import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, MessageCircle, TrendingUp, Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { db } from '../../../lib/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/Common/Loader'

const DSADiscussions = () => {
  const [activeTab, setActiveTab] = useState('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load discussions from Firebase in real-time
  useEffect(() => {
    // Listen to the discussions collection
    const unsubscribe = onSnapshot(collection(db, 'discussions'), (querySnapshot) => {
      const discussionsList = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        discussionsList.push({
          id: doc.id,
          ...data,
          author: data.authorName,
          lastActivity: data.lastActivity?.toDate ? data.lastActivity.toDate().toISOString() : (data.lastActivity instanceof Date ? data.lastActivity.toISOString() : data.lastActivity),
          tags: data.tags || []
        })
      })
      
      // Sort by lastActivity descending
      discussionsList.sort((a, b) => {
        const dateA = new Date(a.lastActivity);
        const dateB = new Date(b.lastActivity);
        return dateB - dateA; // Descending order
      });
      
      setDiscussions(discussionsList)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching discussions:', error)
      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [])

  // Filter discussions based on search query
  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Community Discussions</h1>
                <p className="text-gray-600 mt-1">Connect with other learners and share knowledge</p>
              </div>
              <Link
                to="/dsa/discussions/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                New Discussion
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search discussions..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === 'trending'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp size={16} />
                  Trending
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === 'recent'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Clock size={16} />
                  Recent
                </button>
              </div>
            </div>
          </div>

          {/* Discussions List */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c3e6ec] border-r-[#a7d1d9] animate-spin"></div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">Loading discussions...</p>
              </div>
            ) : filteredDiscussions.length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No discussions found</p>
                <p className="text-gray-500 text-sm mt-2">Be the first to start a discussion!</p>
              </div>
            ) : (
              filteredDiscussions.map((discussion) => (
                <div key={discussion.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="text-gray-500" size={20} />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{discussion.replies}</div>
                        <div className="text-xs text-gray-500">replies</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.isPinned && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Pinned
                          </span>
                        )}
                        <Link
                          to={`/dsa/discussions/${discussion.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600"
                        >
                          {discussion.title}
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {discussion.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {discussion.author}</span>
                        <span>{new Date(discussion.lastActivity).toLocaleDateString()}</span>
                        <span>{discussion.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>
                        {Math.floor(
                          (new Date().getTime() - new Date(discussion.lastActivity).getTime()) /
                            (1000 * 60 * 60)
                        )}h ago
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredDiscussions.length} of {discussions.length} discussions
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DSADiscussions